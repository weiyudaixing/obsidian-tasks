import { createStatusRegistryReport } from '../../src/Statuses/StatusRegistryReport';
import type { StatusCollection } from '../../src/Statuses/StatusCollection';
import { verifyWithFileExtension } from '../TestingTools/ApprovalTestHelpers';
import { coreStatusesData, createStatuses } from '../TestingTools/StatusesTestHelpers';

describe('StatusRegistryReport', function () {
    it('should create a report', () => {
        // Arrange

        const customStatusesData: StatusCollection = [
            ['Task', '/', 'In Progress', 'x', 'IN_PROGRESS'],
            ['Task', '-', 'Cancelled', ' ', 'CANCELLED'],
            ['Question', 'Q', 'Question', 'A', 'TODO'],
            ['Question', 'A', 'Answer', 'Q', 'DONE'],
            ['Task', '', '', '', 'TODO'], // A new, unedited status
        ];
        const { statusSettings, statusRegistry } = createStatuses(coreStatusesData, customStatusesData);

        const reportName = 'Review and check your Statuses';

        // Act
        const version = 'x.y.z'; // lower-case, as the capitalised version would get edited at the next release.
        const report = createStatusRegistryReport(statusSettings, statusRegistry, reportName, version);

        // Assert
        verifyWithFileExtension(report, '.md');
    });
});
