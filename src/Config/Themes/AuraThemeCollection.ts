import type { StatusCollection } from '../../Statuses/StatusCollection';

/**
 * Status supported by the Aura theme. {@link https://github.com/ashwinjadhav818/obsidian-aura}
 * @see {@link StatusSettings.bulkAddStatusCollection}
 */
export function auraSupportedStatuses() {
    const zzz: StatusCollection = [
        ['Task', ' ', 'incomplete', 'x', 'TODO'],
        ['Task', 'x', 'complete / done', ' ', 'DONE'],
        ['Task', '-', 'cancelled', ' ', 'CANCELLED'],
        ['Task', '>', 'deferred', 'x', 'TODO'],
        ['Task', '/', 'in progress, or half-done', 'x', 'IN_PROGRESS'],
        ['Task', '!', 'Important', 'x', 'TODO'],
        ['Task', '?', 'question', 'x', 'TODO'],
        ['Task', 'R', 'review', 'x', 'TODO'],
        ['Task', '+', 'Inbox / task that should be processed later', 'x', 'TODO'],
        ['Task', 'b', 'bookmark', 'x', 'TODO'],
        ['Task', 'B', 'brainstorm', 'x', 'TODO'],
        ['Task', 'D', 'deferred or scheduled', 'x', 'TODO'],
        ['Task', 'I', 'Info', 'x', 'TODO'],
        ['Task', 'i', 'idea', 'x', 'TODO'],
        ['Task', 'N', 'note', 'x', 'TODO'],
        ['Task', 'Q', 'quote', 'x', 'TODO'],
        ['Task', 'W', 'win / success / reward', 'x', 'TODO'],
        ['Task', 'P', 'pro', 'x', 'TODO'],
        ['Task', 'C', 'con', 'x', 'TODO'],
    ];
    return zzz;
}
