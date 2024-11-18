import type { StatusCollection } from '../../Statuses/StatusCollection';

/**
 * Status supported by the Minimal theme. {@link https://github.com/kepano/obsidian-minimal}
 * Values recognised by Tasks are excluded.
 * @see {@link StatusSettings.bulkAddStatusCollection}
 */
export function minimalSupportedStatuses() {
    const zzz: StatusCollection = [
        ['Task', ' ', 'to-do', 'x', 'TODO'],
        ['Task', '/', 'incomplete', 'x', 'IN_PROGRESS'],
        ['Task', 'x', 'done', ' ', 'DONE'],
        ['Task', '-', 'canceled', ' ', 'CANCELLED'],
        ['Task', '>', 'forwarded', 'x', 'TODO'],
        ['Task', '<', 'scheduling', 'x', 'TODO'],
        ['Task', '?', 'question', 'x', 'TODO'],
        ['Task', '!', 'important', 'x', 'TODO'],
        ['Task', '*', 'star', 'x', 'TODO'],
        ['Task', '"', 'quote', 'x', 'TODO'],
        ['Task', 'l', 'location', 'x', 'TODO'],
        ['Task', 'b', 'bookmark', 'x', 'TODO'],
        ['Task', 'i', 'information', 'x', 'TODO'],
        ['Task', 'S', 'savings', 'x', 'TODO'],
        ['Task', 'I', 'idea', 'x', 'TODO'],
        ['Task', 'p', 'pros', 'x', 'TODO'],
        ['Task', 'c', 'cons', 'x', 'TODO'],
        ['Task', 'f', 'fire', 'x', 'TODO'],
        ['Task', 'k', 'key', 'x', 'TODO'],
        ['Task', 'w', 'win', 'x', 'TODO'],
        ['Task', 'u', 'up', 'x', 'TODO'],
        ['Task', 'd', 'down', 'x', 'TODO'],
    ];
    return zzz;
}
