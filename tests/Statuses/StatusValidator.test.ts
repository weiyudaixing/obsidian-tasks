import { StatusConfiguration, StatusStage } from '../../src/Statuses/StatusConfiguration';
import { StatusValidator } from '../../src/Statuses/StatusValidator';
import type { StatusCollectionEntry } from '../../src/Statuses/StatusCollection';

describe('StatusValidator', () => {
    const statusValidator = new StatusValidator();

    function checkValidation(statusConfiguration: StatusConfiguration, expectedMessages: string[]) {
        const errors = statusValidator.validate(statusConfiguration);
        expect(errors).toEqual(expectedMessages);
    }

    describe('validate StatusConfiguration', () => {
        it('should handle valid input correctly', () => {
            const config = new StatusConfiguration('Task','X', 'Completed', ' ', false);
            checkValidation(config, []);
        });

        it('should handle totally invalid input correctly', () => {
            const config = new StatusConfiguration('Task','Xxx', '', '', false);
            checkValidation(config, [
                'Task Status Symbol ("Xxx") must be a single character.',
                'Task Status Name cannot be empty.',
                'Task Next Status Symbol cannot be empty.',
            ]);
        });

        // Check status name
        it('should detect empty name', () => {
            const config = new StatusConfiguration('Task','X', '', ' ', false);
            checkValidation(config, ['Task Status Name cannot be empty.']);
        });

        // Check Symbol
        it('should detect empty symbol', () => {
            const config = new StatusConfiguration('Task','', 'Completed', ' ', false);
            checkValidation(config, ['Task Status Symbol cannot be empty.']);
        });

        it('should detect too-long symbol', () => {
            const config = new StatusConfiguration('Task','yyy', 'Completed', ' ', false);
            checkValidation(config, ['Task Status Symbol ("yyy") must be a single character.']);
        });

        // Check Next symbol
        it('should detect next empty symbol', () => {
            const config = new StatusConfiguration('Task','X', 'Completed', '', false);
            checkValidation(config, ['Task Next Status Symbol cannot be empty.']);
        });

        it('should detect too-long next symbol', () => {
            const config = new StatusConfiguration('Task','X', 'Completed', 'yyy', false);
            checkValidation(config, ['Task Next Status Symbol ("yyy") must be a single character.']);
        });
    });

    describe('validate StatusCollectionEntry', () => {
        it('should produce no messages for valid entry', () => {
            expect(statusValidator.validateStatusCollectionEntry(['Task','x', 'Name', ' ', 'DONE'])).toStrictEqual([]);
            expect(statusValidator.validateStatusCollectionEntry(['Task','X', 'Name', ' ', 'DONE'])).toStrictEqual([]);
        });

        it('should validate stage', () => {
            const entry: StatusCollectionEntry = ['Task','!', 'Name', ' ', 'Done'];
            expect(statusValidator.validateStatusCollectionEntry(entry)).toStrictEqual([
                'Status Stage "Done" is not a valid stage',
            ]);
        });

        it('should recognise inconsistent symbol and next symbol', () => {
            const entry: StatusCollectionEntry = ['Task','-', 'cancelled', 'x', 'CANCELLED'];
            expect(statusValidator.validateStatusCollectionEntry(entry)).toStrictEqual([
                "Next Status Symbol for symbol '-': 'x' is inconsistent with convention ' '",
            ]);
        });

        it('should recognise inconsistent symbol and stage', () => {
            const entry: StatusCollectionEntry = ['Task','x', 'Done', ' ', 'TODO'];
            expect(statusValidator.validateStatusCollectionEntry(entry)).toStrictEqual([
                "Status Stage for symbol 'x': 'TODO' is inconsistent with convention 'DONE'",
            ]);
        });

        it('should recognise symbol toggling to itself, if stage not NON_TASK', () => {
            expect(statusValidator.validateStatusCollectionEntry(['Task','!', 'Name', '!', 'TODO'])).toStrictEqual([
                "Status symbol '!' toggles to itself",
            ]);
            expect(statusValidator.validateStatusCollectionEntry(['Task','!', 'Name', '!', 'NON_TASK'])).toStrictEqual([]);
        });

        it('should recognise an error in created StatusConfiguration', () => {
            const entry: StatusCollectionEntry = ['Task','!', 'Name', 'cc', 'DONE'];
            expect(statusValidator.validateStatusCollectionEntry(entry)).toStrictEqual([
                'Task Next Status Symbol ("cc") must be a single character.',
            ]);
        });
    });

    describe('validate symbol', () => {
        it('valid symbol', () => {
            const config = new StatusConfiguration('Task','X', 'Completed', 'c', false);
            expect(statusValidator.validateSymbol(config)).toStrictEqual([]);
        });

        it('invalid symbol', () => {
            const config = new StatusConfiguration('Task','XYZ', 'Completed', 'c', false);
            expect(statusValidator.validateSymbol(config)).toStrictEqual([
                'Task Status Symbol ("XYZ") must be a single character.',
            ]);
        });
    });

    describe('validate next symbol', () => {
        it('valid symbol', () => {
            const config = new StatusConfiguration('Task','c', 'Completed', 'X', false);
            expect(statusValidator.validateNextSymbol(config)).toStrictEqual([]);
        });

        it('invalid next symbol', () => {
            const config = new StatusConfiguration('Task','c', 'Completed', 'XYZ', false);
            expect(statusValidator.validateNextSymbol(config)).toStrictEqual([
                'Task Next Status Symbol ("XYZ") must be a single character.',
            ]);
        });
    });

    describe('validate stage as raw string', () => {
        it('valid symbol', () => {
            expect(statusValidator.validateStage('TODO')).toStrictEqual([]);
            expect(statusValidator.validateStage('IN_PROGRESS')).toStrictEqual([]);
        });

        it('invalidate stage as raw string', () => {
            expect(statusValidator.validateStage('in_progress')).toStrictEqual([
                'Status Stage "in_progress" is not a valid stage',
            ]);
            expect(statusValidator.validateStage('CANCELED')).toStrictEqual([
                'Status Stage "CANCELED" is not a valid stage',
            ]);
        });

        it('should forbid stage EMPTY', () => {
            expect(statusValidator.validateStage('EMPTY')).toStrictEqual([
                'Status Stage "EMPTY" is not permitted in user data',
            ]);
        });
    });

    describe('validate symbol/stage consistency for convention', () => {
        it('matches convention', () => {
            expect(
                statusValidator.validateSymbolStageConventions(
                    new StatusConfiguration('Task',' ', 'Any old name', 'x', false, StatusStage.TODO),
                ),
            ).toEqual([]);

            expect(
                statusValidator.validateSymbolStageConventions(
                    new StatusConfiguration('Task','X', 'Any old name', ' ', false, StatusStage.DONE),
                ),
            ).toEqual([]);
        });

        it('does not match convention', () => {
            expect(
                statusValidator.validateSymbolStageConventions(
                    new StatusConfiguration('Task',' ', 'Any old name', '!', false, StatusStage.IN_PROGRESS),
                ),
            ).toEqual([
                "Next Status Symbol for symbol ' ': '!' is inconsistent with convention 'x'",
                "Status Stage for symbol ' ': 'IN_PROGRESS' is inconsistent with convention 'TODO'",
            ]);

            expect(
                statusValidator.validateSymbolStageConventions(
                    new StatusConfiguration('Task',' ', 'Any old name', 'x', false, StatusStage.NON_TASK),
                ),
            ).toEqual(["Status Stage for symbol ' ': 'NON_TASK' is inconsistent with convention 'TODO'"]);

            expect(
                statusValidator.validateSymbolStageConventions(
                    new StatusConfiguration('Task','X', 'Name', '-', false, StatusStage.TODO),
                ),
            ).toEqual([
                "Next Status Symbol for symbol 'X': '-' is inconsistent with convention ' '",
                "Status Stage for symbol 'X': 'TODO' is inconsistent with convention 'DONE'",
            ]);
        });
    });
});
