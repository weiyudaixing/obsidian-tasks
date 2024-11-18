import type { StatusCollection } from '../../Statuses/StatusCollection';

/**
 * Status supported by the Ebullientworks theme. {@link https://github.com/ebullient/obsidian-theme-ebullientworks}
 * @see {@link StatusSettings.bulkAddStatusCollection}
 */
export function ebullientworksSupportedStatuses() {
    const zzz: StatusCollection = [
        ['Task', ' ', 'Unchecked', 'x', 'TODO'],
        ['Task', 'x', 'Checked', ' ', 'DONE'],
        ['Task', '-', 'Cancelled', ' ', 'CANCELLED'],
        ['Task', '/', 'In Progress', 'x', 'IN_PROGRESS'],
        ['Task', '>', 'Deferred', 'x', 'TODO'],
        ['Task', '!', 'Important', 'x', 'TODO'],
        ['Task', '?', 'Question', 'x', 'TODO'],
        ['Task', 'r', 'Review', 'x', 'TODO'],
    ];
    return zzz;
}
