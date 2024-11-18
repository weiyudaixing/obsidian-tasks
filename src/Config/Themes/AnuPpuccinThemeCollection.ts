import type { StatusCollection } from '../../Statuses/StatusCollection';

/**
 * Status supported by the AnuPpuccin theme. {@link https://github.com/AnubisNekhet/AnuPpuccin}
 * @see {@link StatusSettings.bulkAddStatusCollection}
 */
export function anuppuccinSupportedStatuses() {
    const zzz: StatusCollection = [
        ['Task',' ', 'Unchecked', 'x', 'TODO'],
        ['Task','x', 'Checked', ' ', 'DONE'],
        ['Task','>', 'Rescheduled', 'x', 'TODO'],
        ['Task','<', 'Scheduled', 'x', 'TODO'],
        ['Task','!', 'Important', 'x', 'TODO'],
        ['Task','-', 'Cancelled', ' ', 'CANCELLED'],
        ['Task','/', 'In Progress', 'x', 'IN_PROGRESS'],
        ['Task','?', 'Question', 'x', 'TODO'],
        ['Task','*', 'Star', 'x', 'TODO'],
        ['Task','n', 'Note', 'x', 'TODO'],
        ['Task','l', 'Location', 'x', 'TODO'],
        ['Task','i', 'Information', 'x', 'TODO'],
        ['Task','I', 'Idea', 'x', 'TODO'],
        ['Task','S', 'Amount', 'x', 'TODO'],
        ['Task','p', 'Pro', 'x', 'TODO'],
        ['Task','c', 'Con', 'x', 'TODO'],
        ['Task','b', 'Bookmark', 'x', 'TODO'],
        ['Task','"', 'Quote', 'x', 'TODO'],
        ['Task','0', 'Speech bubble 0', '0', 'NON_TASK'],
        ['Task','1', 'Speech bubble 1', '1', 'NON_TASK'],
        ['Task','2', 'Speech bubble 2', '2', 'NON_TASK'],
        ['Task','3', 'Speech bubble 3', '3', 'NON_TASK'],
        ['Task','4', 'Speech bubble 4', '4', 'NON_TASK'],
        ['Task','5', 'Speech bubble 5', '5', 'NON_TASK'],
        ['Task','6', 'Speech bubble 6', '6', 'NON_TASK'],
        ['Task','7', 'Speech bubble 7', '7', 'NON_TASK'],
        ['Task','8', 'Speech bubble 8', '8', 'NON_TASK'],
        ['Task','9', 'Speech bubble 9', '9', 'NON_TASK'],
    ];
    return zzz;
}
