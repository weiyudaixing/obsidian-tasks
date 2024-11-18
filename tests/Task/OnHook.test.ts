/**
 * @jest-environment jsdom
 */
import moment from 'moment';
import { verifyAll } from 'approvals/lib/Providers/Jest/JestApprovals';
import { Status } from '../../src/Statuses/Status';
import { StatusConfiguration, StatusStage } from '../../src/Statuses/StatusConfiguration';
import { fromLine, toMarkdown } from '../TestingTools/TestHelpers';
import type { Task } from '../../src/Task/Task';
import { OnHook, handleOnHook, parseOnHookValue } from '../../src/Task/OnHook';

window.moment = moment;

beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-02-11'));
});

afterEach(() => {
    jest.useRealTimers();
    // resetSettings();
});

export function applyStatusAndOnHookAction(task: Task, newStatus: Status) {
    const tasks = task.handleNewStatus(newStatus);
    return handleOnHook(task, tasks);
}

function makeTask(line: string) {
    return fromLine({ line });
}

describe('OnHook - parsing', () => {
    function checkParseOnHookValue(input: string, expected: OnHook) {
        expect(parseOnHookValue(input)).toEqual(expected);
    }

    const deletes = ['delete', 'DELETE', ' delete '];
    it.each(deletes)('should parse "%s" as OnHook.Delete', (input: string) => {
        checkParseOnHookValue(input, OnHook.Delete);
    });

    const keeps = ['keep', 'KEEP', ' keep '];
    it.each(keeps)('should parse "%s" as OnHook.Keep', (input: string) => {
        checkParseOnHookValue(input, OnHook.Keep);
    });

    const ignores = ['', 'unknown'];
    it.each(ignores)('should parse "%s" as OnHook.Ignore', (input: string) => {
        checkParseOnHookValue(input, OnHook.Ignore);
    });
});

describe('OnHook - cases where all tasks are retained', () => {
    it('should not delete an already-done task', () => {
        // Arrange
        const line = '- [x] An already-DONE, non-recurring task 🏁 delete ✅ 2024-02-10';
        const task = makeTask(line);

        // Act
        const returnedTasks = applyStatusAndOnHookAction(task, Status.DONE);

        // Assert
        expect(returnedTasks.length).toEqual(1);
        expect(returnedTasks[0].originalMarkdown).toEqual(line);
    });

    it('should just return trigger-less, non-recurring task', () => {
        // Arrange
        const task = makeTask('- [ ] A non-recurring task with no trigger 📅 2024-02-10');

        // Act
        const tasks = applyStatusAndOnHookAction(task, Status.DONE);

        // Assert
        expect(toMarkdown(tasks)).toMatchInlineSnapshot(
            '"- [x] A non-recurring task with no trigger 📅 2024-02-10 ✅ 2024-02-11"',
        );
    });

    it('should just return trigger-less recurring task', () => {
        // Arrange
        const task = makeTask('- [ ] A recurring task with no trigger 🔁 every day 📅 2024-02-10');

        // Act
        const tasks = applyStatusAndOnHookAction(task, Status.DONE);

        // Assert
        expect(toMarkdown(tasks)).toMatchInlineSnapshot(`
            "- [ ] A recurring task with no trigger 🔁 every day 📅 2024-02-11
            - [x] A recurring task with no trigger 🔁 every day 📅 2024-02-10 ✅ 2024-02-11"
        `);
    });

    it('should return the task when going from TODO to IN_PROGRESS', () => {
        // Arrange
        const task = makeTask('- [ ] A recurring task with "delete" Action 🔁 every day 🏁 delete 📅 2024-02-10');

        // Act
        const tasks = applyStatusAndOnHookAction(task, Status.IN_PROGRESS);

        // Assert
        expect(tasks.length).toEqual(1);
        expect(tasks[0].status.stage).toEqual(StatusStage.IN_PROGRESS);
    });

    it('should return the task when going from one DONE status to another DONE status', () => {
        // Arrange
        const done2 = new Status(new StatusConfiguration('Task', 'X', 'DONE', ' ', true, StatusStage.DONE));
        const task = makeTask('- [x] A simple done task with 🏁 delete');

        // Act
        const tasks = applyStatusAndOnHookAction(task, done2);

        // Assert
        expect(tasks.length).toEqual(1);
        expect(tasks[0].status.symbol).toEqual('X');
        expect(tasks[0].status.stage).toEqual(StatusStage.DONE);
    });

    it('should return a task featuring the On Hook flag trigger but an empty string Action', () => {
        // Arrange
        const task = makeTask('- [ ] A non-recurring task with');

        // Act
        const tasks = applyStatusAndOnHookAction(task, Status.DONE);

        // Assert
        expect(tasks.length).toEqual(1);
    });
});

describe('OnHook - "keep" action', () => {
    it('should retain a task with "keep" Action upon hook', () => {
        // Arrange
        const task = makeTask('- [ ] A non-recurring task with "keep" Action 🏁 keep');

        // Act
        const tasks = applyStatusAndOnHookAction(task, Status.DONE);

        // Assert
        expect(tasks.length).toEqual(1);
    });
});

describe('OnHook - "delete" action', () => {
    it('should retain only the next instance of a recurring task with "delete" Action upon hook', () => {
        // Arrange
        const task = makeTask('- [ ] A recurring task with "delete" Action 🔁 every day 🏁 delete 📅 2024-02-10');

        // Act
        const tasks = applyStatusAndOnHookAction(task, Status.DONE);

        // Assert
        expect(toMarkdown(tasks)).toMatchInlineSnapshot(
            '"- [ ] A recurring task with "delete" Action 🔁 every day 🏁 delete 📅 2024-02-11"',
        );
    });

    it('should discard a task with "delete" Action upon hook', () => {
        // Arrange
        const task = makeTask('- [ ] A non-recurring task with "delete" Action 🏁 delete');

        // Act
        const tasks = applyStatusAndOnHookAction(task, Status.DONE);

        // Assert
        expect(tasks.length).toEqual(0);
    });
});

type ToggleCase = {
    // inputs:
    nextStatus: Status;
    line: string;
};

function getCases(): ToggleCase[] {
    return [
        // Non-recurring
        {
            nextStatus: Status.DONE,
            line: '- [ ] A non-recurring task with no trigger 📅 2024-02-10',
        },

        {
            nextStatus: Status.DONE,
            line: '- [ ] A non-recurring task with 🏁 delete',
        },

        {
            nextStatus: Status.DONE,
            line: '- [ ] A non-recurring task with 🏁 delete 📅 2024-02-10',
        },

        {
            nextStatus: Status.DONE,
            line: '- [ ] A non-recurring task with invalid OC trigger 🏁 INVALID_ACTION 📅 2024-02-10',
        },

        {
            nextStatus: Status.DONE,
            line: '- [ ] A non-recurring task with 🏁',
        },

        // Recurring

        {
            nextStatus: Status.DONE,
            line: '- [ ] A recurring task with no trigger 🔁 every day 📅 2024-02-10',
        },

        {
            nextStatus: Status.DONE,
            line: '- [ ] A recurring task with 🏁 delete 🔁 every day 📅 2024-02-10',
        },

        {
            nextStatus: Status.IN_PROGRESS,
            line: '- [ ] A recurring task with 🏁 delete 🔁 every day 📅 2024-02-10',
        },

        // Other

        {
            nextStatus: Status.DONE,
            line: '- [x] An already-DONE task, changing to Same      DONE status 🏁 delete 📅 2024-02-10 ✅ 2024-02-10',
        },

        {
            nextStatus: new Status(new StatusConfiguration('Task', 'X', 'new status', ' ', false, StatusStage.DONE)),
            line: '- [x] An already-DONE task, changing to Different DONE status 🏁 delete 📅 2024-02-10 ✅ 2024-02-10',
        },

        // Indented, within callout/code block

        {
            nextStatus: Status.DONE,
            line: '    - [ ] An indented task with 🏁 delete',
        },

        {
            nextStatus: Status.DONE,
            line: '> - [ ] A task within a block quote or callout and 🏁 delete',
        },
    ];
}

function action(toggleCase: ToggleCase): string {
    const newStatus = toggleCase.nextStatus;
    const task = fromLine({ line: toggleCase.line, path: 'anything.md', precedingHeader: 'heading' });
    const step1 = task.handleNewStatus(newStatus);
    const step2 = applyStatusAndOnHookAction(task, newStatus);
    return `
initial task:
${task.toFileLineString()}

=> advances to status [${newStatus.symbol}] and type ${newStatus.stage}:
${toMarkdown(step1)}

=> which, after any on-hook action, results in:
${toMarkdown(step2)}
----------------------------------------------
`;
}

describe('visualise hook-behaviour', () => {
    it('visualise', () => {
        // List of status and task
        const cases = getCases();
        verifyAll('checking on hook', cases, (toggleCase) => action(toggleCase));
    });
});
