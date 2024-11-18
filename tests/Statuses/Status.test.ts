/**
 * @jest-environment jsdom
 */
import moment from 'moment';
import { Status } from '../../src/Statuses/Status';
import { StatusConfiguration, StatusStage } from '../../src/Statuses/StatusConfiguration';
import type { StatusCollectionEntry } from '../../src/Statuses/StatusCollection';

jest.mock('obsidian');
window.moment = moment;

describe('Status', () => {
    it('preview text', () => {
        const configuration = new Status(new StatusConfiguration('Task','P', 'Pro', 'C', true, StatusStage.TODO));
        expect(configuration.previewText()).toEqual("- [P] => [C], name: 'Pro', stage: 'TODO'.");
    });

    it('default configurations', () => {
        expect(Status.DONE.previewText()).toEqual("- [x] => [ ], name: 'Done', stage: 'DONE'.");
        expect(Status.EMPTY.previewText()).toEqual("- [] => [], name: 'EMPTY', stage: 'EMPTY'.");
        expect(Status.TODO.previewText()).toEqual("- [ ] => [x], name: 'Todo', stage: 'TODO'.");
    });

    it('factory methods for default statuses', () => {
        expect(Status.DONE.previewText()).toEqual("- [x] => [ ], name: 'Done', stage: 'DONE'.");
        expect(Status.EMPTY.previewText()).toEqual("- [] => [], name: 'EMPTY', stage: 'EMPTY'.");
        expect(Status.TODO.previewText()).toEqual("- [ ] => [x], name: 'Todo', stage: 'TODO'.");
        expect(Status.CANCELLED.previewText()).toEqual("- [-] => [ ], name: 'Cancelled', stage: 'CANCELLED'.");
        expect(Status.IN_PROGRESS.previewText()).toEqual("- [/] => [x], name: 'In Progress', stage: 'IN_PROGRESS'.");
        expect(Status.NON_TASK.previewText()).toEqual("- [Q] => [A], name: 'Non-Task', stage: 'NON_TASK'.");
    });

    it('should initialize with valid properties', () => {
        // Arrange
        const objectClass ='Task';
        const symbol = '/';
        const name = 'In Progress';
        const next = 'x';

        // Act
        const status = new Status(new StatusConfiguration(objectClass, symbol, name, next, false, StatusStage.IN_PROGRESS));

        // Assert
        expect(status).not.toBeNull();
        expect(status!.objectClass).toEqual(objectClass);
        expect(status!.symbol).toEqual(symbol);
        expect(status!.name).toEqual(name);
        expect(status!.nextStatusSymbol).toEqual(next);
        expect(status!.stage).toEqual(StatusStage.IN_PROGRESS);
        expect(status!.isCompleted()).toEqual(false);
    });

    it('should be complete when symbol is "x"', () => {
        // Arrange
        const symbol = 'x';
        const name = 'Done';
        const next = ' ';

        // Act
        const status = new Status(new StatusConfiguration('Task',symbol, name, next, false, StatusStage.DONE));

        // Assert
        expect(status).not.toBeNull();
        expect(status!.symbol).toEqual(symbol);
        expect(status!.name).toEqual(name);
        expect(status!.nextStatusSymbol).toEqual(next);
        expect(status!.isCompleted()).toEqual(true);
    });

    it('should deduce stage for unknown symbols', () => {
        expect(Status.getStageForUnknownSymbol(' ')).toEqual(StatusStage.TODO);
        expect(Status.getStageForUnknownSymbol('!')).toEqual(StatusStage.TODO); // Unknown character treated as TODO
        expect(Status.getStageForUnknownSymbol('x')).toEqual(StatusStage.DONE);
        expect(Status.getStageForUnknownSymbol('X')).toEqual(StatusStage.DONE);
        expect(Status.getStageForUnknownSymbol('/')).toEqual(StatusStage.IN_PROGRESS);
        expect(Status.getStageForUnknownSymbol('-')).toEqual(StatusStage.CANCELLED);
        expect(Status.getStageForUnknownSymbol('')).toEqual(StatusStage.EMPTY);
    });

    it('should deduce stage from StatusStage text', () => {
        expect(Status.getStageFromStatusStageString('TODO')).toEqual(StatusStage.TODO);
        expect(Status.getStageFromStatusStageString('DONE')).toEqual(StatusStage.DONE);
        expect(Status.getStageFromStatusStageString('IN_PROGRESS')).toEqual(StatusStage.IN_PROGRESS);
        expect(Status.getStageFromStatusStageString('CANCELLED')).toEqual(StatusStage.CANCELLED);
        expect(Status.getStageFromStatusStageString('NON_TASK')).toEqual(StatusStage.NON_TASK);
        expect(Status.getStageFromStatusStageString('EMPTY')).toEqual(StatusStage.EMPTY);
        expect(Status.getStageFromStatusStageString('i do not exist')).toEqual(StatusStage.TODO);
    });

    it('should construct a Status for unknown symbol', () => {
        // Arrange
        const symbol = '/';

        // Act
        const status = Status.createUnknownStatus(symbol);

        // Assert
        expect(status).not.toBeNull();
        expect(status!.symbol).toEqual(symbol);
        expect(status!.name).toEqual('Unknown');
        expect(status!.nextStatusSymbol).toEqual('x');
        // Even though the stage *could* be deduced as IN_PROGRESS, createUnknownStatus() is used when
        // the user has not defined the meaning of a status symbol, so treat everything as TODO.
        expect(status!.stage).toEqual(StatusStage.TODO);
        expect(status!.isCompleted()).toEqual(false);
    });

    it('should construct a Status from a core imported value', () => {
        const imported: StatusCollectionEntry = ['Task', '/', 'in progress', 'x', 'IN_PROGRESS'];
        const status = Status.createFromImportedValue(imported);
        expect(status.objectClass).toEqual('Task')
        expect(status.symbol).toEqual('/');
        expect(status.name).toEqual('in progress');
        expect(status.nextStatusSymbol).toEqual('x');
        expect(status.stage).toEqual(StatusStage.IN_PROGRESS); // should deduce IN_PROGRESS from symbol '/'
        expect(status.availableAsCommand).toEqual(false);
    });

    it('should construct a Status from a custom imported value', () => {
        const imported: StatusCollectionEntry = ['Task', 'P', 'Pro', 'C', 'NON_TASK'];
        const status = Status.createFromImportedValue(imported);
        expect(status.objectClass).toEqual('Task')
        expect(status.symbol).toEqual('P');
        expect(status.name).toEqual('Pro');
        expect(status.nextStatusSymbol).toEqual('C');
        expect(status.stage).toEqual(StatusStage.NON_TASK);
        expect(status.availableAsCommand).toEqual(false);
    });

    it('should provide text with sorting comments for convenience of custom grouping', () => {
        const status = Status.CANCELLED;
        expect(status.stageGroupText).toEqual('%%4%%CANCELLED');
    });
});

describe('identicalTo', () => {
    const objectClass = 'Task';
    const symbol = 'P';
    const name = 'Pro';
    const nextStatusSymbol = 'C';
    const availableAsCommand = true;
    const stage = StatusStage.TODO;

    it('should detect identical objects', () => {
        const lhs = new Status(new StatusConfiguration(objectClass, symbol, name, nextStatusSymbol, availableAsCommand, stage));
        const rhs = new Status(new StatusConfiguration(objectClass, symbol, name, nextStatusSymbol, availableAsCommand, stage));
        expect(lhs.identicalTo(rhs)).toEqual(true);
    });

    it('should check symbol', () => {
        const lhs = new Status(new StatusConfiguration(objectClass, symbol, name, nextStatusSymbol, availableAsCommand, stage));
        const rhs = new Status(new StatusConfiguration(objectClass, 'Q', name, nextStatusSymbol, availableAsCommand, stage));
        expect(lhs.identicalTo(rhs)).toEqual(false);
    });

    it('should check name', () => {
        const lhs = new Status(new StatusConfiguration(objectClass, symbol, name, nextStatusSymbol, availableAsCommand, stage));
        const rhs = new Status(new StatusConfiguration(objectClass, symbol, 'Con', nextStatusSymbol, availableAsCommand, stage));
        expect(lhs.identicalTo(rhs)).toEqual(false);
    });

    it('should check nextStatusSymbol', () => {
        const lhs = new Status(new StatusConfiguration(objectClass, symbol, name, nextStatusSymbol, availableAsCommand, stage));
        const rhs = new Status(new StatusConfiguration(objectClass, symbol, name, ' ', availableAsCommand, stage));
        expect(lhs.identicalTo(rhs)).toEqual(false);
    });

    it('should check availableAsCommand', () => {
        const lhs = new Status(new StatusConfiguration(objectClass, symbol, name, nextStatusSymbol, availableAsCommand, stage));
        const rhs = new Status(new StatusConfiguration(objectClass, symbol, name, nextStatusSymbol, false, stage));
        expect(lhs.identicalTo(rhs)).toEqual(false);
    });

    it('should check stage', () => {
        const lhs = new Status(
            new StatusConfiguration(objectClass, symbol, name, nextStatusSymbol, availableAsCommand, StatusStage.CANCELLED),
        );
        const rhs = new Status(new StatusConfiguration(objectClass, symbol, name, nextStatusSymbol, availableAsCommand, stage));
        expect(lhs.identicalTo(rhs)).toEqual(false);
    });
});
