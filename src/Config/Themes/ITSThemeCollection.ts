import type { StatusCollection } from '../../Statuses/StatusCollection';

/**
 * Status supported by the ITS theme. {@link https://github.com/SlRvb/Obsidian--ITS-Theme}
 * Values recognised by Tasks are excluded.
 * @see {@link StatusSettings.bulkAddStatusCollection}
 */
export function itsSupportedStatuses() {
    const zzz: StatusCollection = [
        ['Task', ' ', 'Unchecked', 'x', 'TODO'],
        ['Task', 'x', 'Regular', ' ', 'DONE'],
        ['Task', 'X', 'Checked', ' ', 'DONE'],
        ['Task', '-', 'Dropped', ' ', 'CANCELLED'],
        ['Task', '>', 'Forward', 'x', 'TODO'],
        ['Task', 'D', 'Date', 'x', 'TODO'],
        ['Task', '?', 'Question', 'x', 'TODO'],
        ['Task', '/', 'Half Done', 'x', 'IN_PROGRESS'],
        ['Task', '+', 'Add', 'x', 'TODO'],
        ['Task', 'R', 'Research', 'x', 'TODO'],
        ['Task', '!', 'Important', 'x', 'TODO'],
        ['Task', 'i', 'Idea', 'x', 'TODO'],
        ['Task', 'B', 'Brainstorm', 'x', 'TODO'],
        ['Task', 'P', 'Pro', 'x', 'TODO'],
        ['Task', 'C', 'Con', 'x', 'TODO'],
        ['Task', 'Q', 'Quote', 'x', 'TODO'],
        ['Task', 'N', 'Note', 'x', 'TODO'],
        ['Task', 'b', 'Bookmark', 'x', 'TODO'],
        ['Task', 'I', 'Information', 'x', 'TODO'],
        ['Task', 'p', 'Paraphrase', 'x', 'TODO'],
        ['Task', 'L', 'Location', 'x', 'TODO'],
        ['Task', 'E', 'Example', 'x', 'TODO'],
        ['Task', 'A', 'Answer', 'x', 'TODO'],
        ['Task', 'r', 'Reward', 'x', 'TODO'],
        ['Task', 'c', 'Choice', 'x', 'TODO'],
        ['Task', 'd', 'Doing', 'x', 'IN_PROGRESS'],
        ['Task', 'T', 'Time', 'x', 'TODO'],
        ['Task', '@', 'Character / Person', 'x', 'TODO'],
        ['Task', 't', 'Talk', 'x', 'TODO'],
        ['Task', 'O', 'Outline / Plot', 'x', 'TODO'],
        ['Task', '~', 'Conflict', 'x', 'TODO'],
        ['Task', 'W', 'World', 'x', 'TODO'],
        ['Task', 'f', 'Clue / Find', 'x', 'TODO'],
        ['Task', 'F', 'Foreshadow', 'x', 'TODO'],
        ['Task', 'H', 'Favorite / Health', 'x', 'TODO'],
        ['Task', '&', 'Symbolism', 'x', 'TODO'],
        ['Task', 's', 'Secret', 'x', 'TODO'],
    ];
    return zzz;
}
