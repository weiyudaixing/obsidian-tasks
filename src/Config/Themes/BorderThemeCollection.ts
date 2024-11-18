import type { StatusCollection } from '../../Statuses/StatusCollection';

/**
 * Statuses supported by the Border theme. {@link https://github.com/Akifyss/obsidian-border?tab=readme-ov-file#alternate-checkboxes}
 * @see {@link StatusSettings.bulkAddStatusCollection}
 */
export function borderSupportedStatuses() {
    const zzz: StatusCollection = [
        ['Task', ' ', 'To Do', 'x', 'TODO'],
        ['Task', '/', 'In Progress', 'x', 'IN_PROGRESS'],
        ['Task', 'x', 'Done', ' ', 'DONE'],
        ['Task', '-', 'Cancelled', ' ', 'CANCELLED'],
        ['Task', '>', 'Rescheduled', 'x', 'TODO'],
        ['Task', '<', 'Scheduled', 'x', 'TODO'],
        ['Task', '!', 'Important', 'x', 'TODO'],
        ['Task', '?', 'Question', 'x', 'TODO'],
        ['Task', 'i', 'Infomation', 'x', 'TODO'],
        ['Task', 'S', 'Amount', 'x', 'TODO'],
        ['Task', '*', 'Star', 'x', 'TODO'],
        ['Task', 'b', 'Bookmark', 'x', 'TODO'],
        ['Task', '“', 'Quote', 'x', 'TODO'],
        ['Task', 'n', 'Note', 'x', 'TODO'],
        ['Task', 'l', 'Location', 'x', 'TODO'],
        ['Task', 'I', 'Idea', 'x', 'TODO'],
        ['Task', 'p', 'Pro', 'x', 'TODO'],
        ['Task', 'c', 'Con', 'x', 'TODO'],
        ['Task', 'u', 'Up', 'x', 'TODO'],
        ['Task', 'd', 'Down', 'x', 'TODO'],
    ];
    return zzz;
}
