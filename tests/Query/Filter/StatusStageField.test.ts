import { StatusStageField } from '../../../src/Query/Filter/StatusStageField';
import {
    expectTaskComparesAfter,
    expectTaskComparesBefore,
    expectTaskComparesEqual,
} from '../../CustomMatchers/CustomMatchersForSorting';
import { TaskBuilder } from '../../TestingTools/TaskBuilder';
import { StatusStage } from '../../../src/Statuses/StatusConfiguration';
import { Status } from '../../../src/Statuses/Status';
import * as FilterParser from '../../../src/Query/FilterParser';
import { fromLine } from '../../TestingTools/TestHelpers';
import { SampleTasks } from '../../TestingTools/SampleTasks';

// Abbreviated names so that the markdown text is aligned
const todoTask = fromLine({ line: '- [ ] Todo' });
const inprTask = fromLine({ line: '- [/] In progress' });
const doneTask = fromLine({ line: '- [x] Done' });
const cancTask = fromLine({ line: '- [-] Cancelled' });
const unknTask = fromLine({ line: '- [%] Unknown' });
const non_Task = new TaskBuilder()
    .statusValues('Task', '^', 'non-task', 'x', false, StatusStage.NON_TASK)
    .description('Non-task')
    .build();
const emptTask = new TaskBuilder().status(Status.EMPTY).description('Empty task').build();

describe('status.name', () => {
    it('value', () => {
        // Arrange
        const filter = new StatusStageField();

        // Assert
        expect(filter.value(cancTask)).toStrictEqual('CANCELLED');
        expect(filter.value(doneTask)).toStrictEqual('DONE');
        expect(filter.value(inprTask)).toStrictEqual('IN_PROGRESS');
        expect(filter.value(non_Task)).toStrictEqual('NON_TASK');
        expect(filter.value(todoTask)).toStrictEqual('TODO');
        expect(filter.value(unknTask)).toStrictEqual('TODO');
    });

    it('status.stage is', () => {
        // Arrange
        const filter = new StatusStageField().createFilterOrErrorMessage('status.stage is IN_PROGRESS');

        // Assert
        expect(filter).toBeValid();
        expect(filter).toMatchTask(inprTask);
        expect(filter).not.toMatchTask(todoTask);
    });

    it('status.stage is not', () => {
        // Arrange
        const filter = new StatusStageField().createFilterOrErrorMessage('status.stage is not IN_PROGRESS');

        // Assert
        expect(filter).toBeValid();
        expect(filter).not.toMatchTask(inprTask);
        expect(filter).toMatchTask(todoTask);
    });

    it('status.stage is - works with incorrect case', () => {
        // Arrange
        const filter = new StatusStageField().createFilterOrErrorMessage('status.stage is in_progress');

        // Assert
        expect(filter).toBeValid();
        expect(filter).toMatchTask(inprTask);
        expect(filter).not.toMatchTask(todoTask);
    });

    it('status-name is not valid', () => {
        // Arrange
        const filter = new StatusStageField().createFilterOrErrorMessage('status-stage is NON_TASK');

        // Assert
        // Check that the '.' in status.name is interpreted exactly as a dot.
        expect(filter).not.toBeValid();
    });

    it('status.name with invalid line is parsed and user sees helpful message', () => {
        // Arrange
        const filter = FilterParser.parseFilter('status.stage gobbledygook');

        // Assert
        expect(filter).not.toBeValid();
        expect(filter?.error).toMatchInlineSnapshot(`
            "Invalid status.stage instruction: 'status.stage gobbledygook'.
                Allowed options: 'is' and 'is not' (without quotes).
                Allowed values:  TODO IN_PROGRESS DONE ARCHIVED CANCELLED HOOK NON_TASK
                                 Note: values are case-insensitive,
                                       so 'in_progress' works too, for example.
                Example:         status.stage is not NON_TASK"
        `);
    });
});

describe('sorting by status.name', () => {
    it('supports Field sorting methods correctly', () => {
        const field = new StatusStageField();
        expect(field.supportsSorting()).toEqual(true);
    });

    it('should parse sort line correctly', () => {
        expect(new StatusStageField().createSorterFromLine('sort by status.stage reverse')).not.toBeNull();
        expect(new StatusStageField().createSorterFromLine('sort by status-stage reverse')).toBeNull();
    });

    it('sort by status.name', () => {
        // Arrange
        const sorter = new StatusStageField().createNormalSorter();

        // Assert
        expectTaskComparesEqual(sorter, cancTask, cancTask);
        expectTaskComparesEqual(sorter, todoTask, unknTask); // Unknown treated as TODO

        // Most actionable stage first..
        expectTaskComparesBefore(sorter, inprTask, todoTask);
        expectTaskComparesBefore(sorter, todoTask, doneTask);
        expectTaskComparesBefore(sorter, doneTask, cancTask);
        expectTaskComparesBefore(sorter, cancTask, non_Task);

        // Users won't see empty tasks, but test them anyway
        expectTaskComparesBefore(sorter, doneTask, emptTask);
        expectTaskComparesAfter(sorter, emptTask, inprTask);
    });

    it('sort by status.name reverse', () => {
        // Arrange
        const sorter = new StatusStageField().createReverseSorter();

        // Assert
        expectTaskComparesEqual(sorter, cancTask, cancTask);
        expectTaskComparesEqual(sorter, todoTask, unknTask); // Unknown treated as TODO

        // Reverse of  order by status name
        expectTaskComparesAfter(sorter, inprTask, todoTask);
        expectTaskComparesAfter(sorter, todoTask, doneTask);
        expectTaskComparesAfter(sorter, doneTask, cancTask);
        expectTaskComparesAfter(sorter, cancTask, non_Task);

        // Users won't see empty tasks, but test them anyway
        expectTaskComparesAfter(sorter, doneTask, emptTask);
        expectTaskComparesBefore(sorter, emptTask, inprTask);
    });
});

describe('grouping by status.stage', () => {
    it('supports Field grouping methods correctly', () => {
        expect(new StatusStageField()).toSupportGroupingWithProperty('status.stage');
    });

    it('group by status.stage', () => {
        // Arrange
        const grouper = new StatusStageField().createNormalGrouper();

        // // Assert
        expect({ grouper, tasks: [inprTask] }).groupHeadingsToBe(['%%1%%IN_PROGRESS']);
        expect({ grouper, tasks: [todoTask] }).groupHeadingsToBe(['%%2%%TODO']);
        expect({ grouper, tasks: [unknTask] }).groupHeadingsToBe(['%%2%%TODO']);
        expect({ grouper, tasks: [doneTask] }).groupHeadingsToBe(['%%3%%DONE']);
        expect({ grouper, tasks: [cancTask] }).groupHeadingsToBe(['%%5%%CANCELLED']);
        expect({ grouper, tasks: [non_Task] }).groupHeadingsToBe(['%%5%%NON_TASK']);
        expect({ grouper, tasks: [emptTask] }).groupHeadingsToBe(['%%6%%EMPTY']); // won't be seen by users
    });

    it('should sort groups for StatusStageField', () => {
        const grouper = new StatusStageField().createNormalGrouper();
        const tasks = SampleTasks.withAllStatusStages();

        expect({ grouper, tasks }).groupHeadingsToBe([
            '%%1%%IN_PROGRESS',
            '%%2%%TODO',
            '%%3%%DONE',
            '%%5%%CANCELLED',
            '%%6%%NON_TASK',
            '%%7%%EMPTY',
        ]);
    });
});
