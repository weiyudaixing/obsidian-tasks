import { StatusSettings } from '../../src/Config/StatusSettings';
import { tabulateStatusSettings } from '../../src/Statuses/StatusSettingsReport';
import type { StatusCollection } from '../../src/Statuses/StatusCollection';
import { verifyWithFileExtension } from '../TestingTools/ApprovalTestHelpers';
import { coreStatusesData, createStatuses } from '../TestingTools/StatusesTestHelpers';

describe('StatusSettingsReport', () => {
    it('should tabulate StatusSettings', () => {
        const statusSettings = new StatusSettings();
        const markdown = tabulateStatusSettings(statusSettings);
        verifyWithFileExtension(markdown, '.md');
    });

    it('should include problems in table', () => {
        const customStatusesData: StatusCollection = [
            ['Task', '/', 'In Progress', 'x', 'IN_PROGRESS'],
            ['Task', '/', 'In Progress DUPLICATE', 'x', 'IN_PROGRESS'],
            ['Task', 'X', 'X - conventionally DONE, but this is CANCELLED', ' ', 'CANCELLED'],
            ['Task', '', '', '', 'TODO'], // A new, unedited status
            ['Task', 'p', 'Unknown next symbol', 'q', 'TODO'],
            ['Task', 'c', 'Followed by d', 'd', 'TODO'],
            ['Task', 'n', 'Non-task', 'n', 'NON_TASK'],
            ['Task', '1', 'DONE followed by TODO', ' ', 'DONE'],
            ['Task', '2', 'DONE followed by IN_PROGRESS', '/', 'DONE'],
            ['Task', '3', 'DONE followed by DONE', 'x', 'DONE'],
            ['Task', '4', 'DONE followed by CANCELLED', 'X', 'DONE'],
            ['Task', '5', 'DONE followed by NON_TASK', 'n', 'DONE'],
        ];
        const { statusSettings } = createStatuses(coreStatusesData, customStatusesData);

        const markdown = tabulateStatusSettings(statusSettings);
        verifyWithFileExtension(markdown, '.md');
    });
});
