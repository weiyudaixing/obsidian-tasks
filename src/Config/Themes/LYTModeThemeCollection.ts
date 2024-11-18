import type { StatusCollection } from '../../Statuses/StatusCollection';

/**
 * Status supported by the LYT Mode theme. {@link https://github.com/nickmilo/LYT-Mode}
 * @see {@link StatusSettings.bulkAddStatusCollection}
 */
export function lytModeSupportedStatuses() {
    const zzz: StatusCollection = [
        ['Task', ' ', 'Unchecked', 'x', 'TODO'],
        ['Task', 'x', 'Checked', ' ', 'DONE'],
        ['Task', '>', 'Rescheduled', 'x', 'TODO'],
        ['Task', '<', 'Scheduled', 'x', 'TODO'],
        ['Task', '!', 'Important', 'x', 'TODO'],
        ['Task', '-', 'Cancelled', ' ', 'CANCELLED'],
        ['Task', '/', 'In Progress', 'x', 'IN_PROGRESS'],
        ['Task', '?', 'Question', 'x', 'TODO'],
        ['Task', '*', 'Star', 'x', 'TODO'],
        ['Task', 'n', 'Note', 'x', 'TODO'],
        ['Task', 'l', 'Location', 'x', 'TODO'],
        ['Task', 'i', 'Information', 'x', 'TODO'],
        ['Task', 'I', 'Idea', 'x', 'TODO'],
        ['Task', 'S', 'Amount', 'x', 'TODO'],
        ['Task', 'p', 'Pro', 'x', 'TODO'],
        ['Task', 'c', 'Con', 'x', 'TODO'],
        ['Task', 'b', 'Bookmark', 'x', 'TODO'],
        ['Task', 'f', 'Fire', 'x', 'TODO'],
        ['Task', 'k', 'Key', 'x', 'TODO'],
        ['Task', 'w', 'Win', 'x', 'TODO'],
        ['Task', 'u', 'Up', 'x', 'TODO'],
        ['Task', 'd', 'Down', 'x', 'TODO'],
    ];
    return zzz;
}
