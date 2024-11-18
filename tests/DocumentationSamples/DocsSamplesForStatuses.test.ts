import { Status } from '../../src/Statuses/Status';
import { StatusConfiguration, StatusStage } from '../../src/Statuses/StatusConfiguration';
import type { StatusCollection, StatusCollectionEntry } from '../../src/Statuses/StatusCollection';
import * as Themes from '../../src/Config/Themes';
import { StatusValidator } from '../../src/Statuses/StatusValidator';
import * as VerifyStatuses from '../TestingTools/VerifyStatuses';
import * as StatusExamples from '../TestingTools/StatusExamples';
import { constructStatuses } from '../TestingTools/StatusesTestHelpers';

describe('DefaultStatuses', () => {
    // These "test" write out a markdown representation of the default task statuses,
    // for embedding in the user docs.
    it('core-statuses', () => {
        VerifyStatuses.verifyStatusesInMultipleFormats([Status.TODO, Status.DONE], true);
    });

    it('custom-statuses', () => {
        VerifyStatuses.verifyStatusesInMultipleFormats([Status.IN_PROGRESS, Status.CANCELLED], true);
    });

    it('important-cycle', () => {
        const statuses = StatusExamples.importantCycle();
        VerifyStatuses.verifyStatusesInMultipleFormats(constructStatuses(statuses), false);
    });

    it('todo-in_progress-done', () => {
        const statuses = StatusExamples.todoToInProgressToDone();
        VerifyStatuses.verifyStatusesInMultipleFormats(constructStatuses(statuses), false);
        VerifyStatuses.verifyStatusesAsDetailedMermaidDiagram(constructStatuses(statuses));
    });

    it('pro-con-cycle', () => {
        const statuses = StatusExamples.proCon();
        VerifyStatuses.verifyStatusesInMultipleFormats(constructStatuses(statuses), false);
        VerifyStatuses.verifyStatusesAsDetailedMermaidDiagram(constructStatuses(statuses));
    });

    it('toggle-does-nothing', () => {
        const statuses = StatusExamples.variousNonTaskStatuses();
        VerifyStatuses.verifyStatusesInMultipleFormats(constructStatuses(statuses), false);
    });

    it('done-toggles-to-cancelled', () => {
        // See issue #2089.
        // DONE is followed by CANCELLED, which currently causes unexpected behaviour in recurrent tasks.
        // This uses the 4 default statuses, and just customises their order.
        const statuses = StatusExamples.doneTogglesToCancelled();
        VerifyStatuses.verifyStatusesAsDetailedMermaidDiagram(constructStatuses(statuses));
    });

    it('done-toggles-to-cancelled-with-unconventional-symbols', () => {
        // See issue #2304.
        // DONE is followed by CANCELLED, which currently causes unexpected behaviour in recurrent tasks.
        // This doesn't follow the standard convention of 'x' means DONE. It has 'x' means CANCELLED.
        const statuses = StatusExamples.doneTogglesToCancelledWithUnconventionalSymbols();
        VerifyStatuses.verifyStatusesAsDetailedMermaidDiagram(constructStatuses(statuses));
    });
});

describe('Theme', () => {
    type NamedTheme = [string, StatusCollection];
    const themes: NamedTheme[] = [
        // Alphabetical order by name:
        ['AnuPpuccin', Themes.anuppuccinSupportedStatuses()],
        ['Aura', Themes.auraSupportedStatuses()],
        ['Border', Themes.borderSupportedStatuses()],
        ['Ebullientworks', Themes.ebullientworksSupportedStatuses()],
        ['ITS', Themes.itsSupportedStatuses()],
        ['LYT Mode', Themes.lytModeSupportedStatuses()],
        ['Minimal', Themes.minimalSupportedStatuses()],
        ['Things', Themes.thingsSupportedStatuses()],
    ];

    describe.each(themes)('%s', (_: string, statuses: StatusCollection) => {
        it.each(statuses)('Validate status: "%s","%s", "%s", "%s", "%s"', (objectClass, symbol, name, nextSymbol, stage) => {
            const statusValidator = new StatusValidator();
            const entry: StatusCollectionEntry = [objectClass, symbol, name, nextSymbol, stage];
            expect(statusValidator.validateStatusCollectionEntry(entry)).toEqual([]);
        });

        it('Table', () => {
            VerifyStatuses.verifyStatusesInMultipleFormats(constructStatuses(statuses), true);
        });

        it('Tasks', () => {
            VerifyStatuses.verifyStatusesAsTasksList(constructStatuses(statuses));
        });

        it('Text', () => {
            VerifyStatuses.verifyStatusesAsTasksText(constructStatuses(statuses));
        });
    });
});

describe('Status Transitions', () => {
    it('status-stages', () => {
        const statuses = [
            Status.TODO,
            Status.IN_PROGRESS,
            Status.DONE,
            Status.CANCELLED,
            new Status(new StatusConfiguration('Task','~', 'My custom status', ' ', false, StatusStage.NON_TASK)),
        ];
        VerifyStatuses.verifyTransitionsAsMarkdownTable(statuses);
    });
});
