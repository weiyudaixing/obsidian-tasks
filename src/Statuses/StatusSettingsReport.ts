import { StatusSettings } from '../Config/StatusSettings';
import { MarkdownTable } from '../lib/MarkdownTable';
import type { StatusConfiguration } from './StatusConfiguration';
import { StatusStage } from './StatusConfiguration';
import { Status } from './Status';

function getFirstIndex(statusConfigurations: StatusConfiguration[], wantedSymbol: string) {
    return statusConfigurations.findIndex((s) => s.symbol === wantedSymbol);
}

export function getPrintableSymbol(symbol: string) {
    // Do not put backticks around an empty symbol, as the two backticks are rendered
    // by Obsidian as ordinary characters and the meaning is unclear.
    // Better to just display nothing in this situation.
    if (symbol === '') {
        return symbol;
    }
    const result = symbol !== ' ' ? symbol : 'space';
    return '`' + result + '`';
}

function checkIfConventionalStage(status: StatusConfiguration, problems: string[]) {
    // Check if conventional stage is being used:
    const conventionalStage = Status.getStageForUnknownSymbol(status.symbol);
    if (status.stage === conventionalStage) {
        return;
    }

    if (conventionalStage === StatusStage.TODO && status.symbol !== ' ') {
        // This was likely a default TODO - ignore it.
        return;
    }

    problems.push(
        `For information, the conventional stage for status symbol ${getPrintableSymbol(
            status.symbol,
        )} is ${getPrintableSymbol(conventionalStage)}: you may wish to review this stage.`,
    );
}

function checkNextStatusSymbol(statuses: StatusConfiguration[], status: StatusConfiguration, problems: string[]) {
    // Check if next symbol is known
    const indexOfNextSymbol = getFirstIndex(statuses, status.nextStatusSymbol);
    if (indexOfNextSymbol === -1) {
        problems.push(
            `Next symbol ${getPrintableSymbol(
                status.nextStatusSymbol,
            )} is unknown: create a status with symbol ${getPrintableSymbol(status.nextStatusSymbol)}.`,
        );
        return;
    }

    if (status.stage !== StatusStage.DONE) {
        return;
    }

    // This stage is DONE: check that next status stage is TODO or IN_PROGRESS.
    // See issues #2089 and #2304.
    const nextStatus = statuses[indexOfNextSymbol];
    if (nextStatus) {
        if (nextStatus.stage !== 'TODO' && nextStatus.stage !== 'IN_PROGRESS') {
            const helpURL =
                'https://publish.obsidian.md/tasks/Getting+Started/Statuses/Recurring+Tasks+and+Custom+Statuses';
            const message = [
                `This \`DONE\` status is followed by ${getPrintableSymbol(
                    nextStatus.stage,
                )}, not \`TODO\` or \`IN_PROGRESS\`.`,
                'If used to complete a recurring task, it will instead be followed by `TODO` or `IN_PROGRESS`, to ensure the next task matches the `not done` filter.',
                `See [Recurring Tasks and Custom Statuses](${helpURL}).`,
            ].join('<br>');
            problems.push(message);
        }
    } else {
        problems.push('Unexpected failure to find the next status.');
    }
}

function getProblemsForStatus(statuses: StatusConfiguration[], status: StatusConfiguration, index: number) {
    const problems: string[] = [];
    if (status.symbol === Status.EMPTY.symbol) {
        problems.push('Empty symbol: this status will be ignored.');
        return problems;
    }

    const firstIndex = getFirstIndex(statuses, status.symbol);
    if (firstIndex != index) {
        problems.push(`Duplicate symbol '${getPrintableSymbol(status.symbol)}': this status will be ignored.`);
        return problems;
    }

    checkIfConventionalStage(status, problems);
    checkNextStatusSymbol(statuses, status, problems);
    return problems;
}

export function tabulateStatusSettings(statusSettings: StatusSettings) {
    // Note: There is very similar code in verifyStatusesAsMarkdownTable() in DocsSamplesForStatuses.test.ts.
    //       Maybe try unifying the common code one day?

    const table = new MarkdownTable([
        'Object Class of Status',
        'Status Symbol',
        'Next Status Symbol',
        'Status Name',
        'Status Stage',
        'Problems (if any)',
    ]);

    const statuses: StatusConfiguration[] = StatusSettings.allStatuses(statusSettings);
    statuses.forEach((status, index) => {
        table.addRow([
            status.objectClass,
            getPrintableSymbol(status.symbol),
            getPrintableSymbol(status.nextStatusSymbol),
            status.name,
            getPrintableSymbol(status.stage),
            getProblemsForStatus(statuses, status, index).join('<br>'),
        ]);
    });
    return table.markdown;
}
