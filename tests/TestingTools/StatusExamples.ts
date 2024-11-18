import type { StatusCollection } from '../../src/Statuses/StatusCollection';

export function doneTogglesToCancelled() {
    const statuses: StatusCollection = [
        ['Task',' ', 'Todo', '/', 'TODO'],
        ['Task','x', 'Done', '-', 'DONE'],
        ['Task','/', 'In Progress', 'x', 'IN_PROGRESS'],
        ['Task','-', 'Cancelled', ' ', 'CANCELLED'],
    ];
    return statuses;
}

export function doneTogglesToCancelledWithUnconventionalSymbols() {
    const statuses: StatusCollection = [
        ['Task',' ', 'Todo', '*', 'TODO'],
        ['Task','*', 'Done', 'x', 'DONE'],
        ['Task','x', 'Cancelled', ' ', 'CANCELLED'],
    ];
    return statuses;
}

export function variousNonTaskStatuses() {
    const importantCycle: StatusCollection = [
        ['Task','b', 'Bookmark', 'b', 'NON_TASK'],
        ['Task','E', 'Example', 'E', 'NON_TASK'],
        ['Task','I', 'Information', 'I', 'NON_TASK'],
        ['Task','P', 'Paraphrase', 'P', 'NON_TASK'],
        ['Task','q', 'Quote', 'q', 'NON_TASK'],
    ];
    return importantCycle;
}

export function importantCycle() {
    const importantCycle: StatusCollection = [
        ['Task','!', 'Important', 'D', 'TODO'],
        ['Task','D', 'Doing - Important', 'X', 'IN_PROGRESS'],
        ['Task','X', 'Done - Important', '!', 'DONE'],
    ];
    return importantCycle;
}

export function todoToInProgressToDone() {
    const importantCycle: StatusCollection = [
        ['Task',' ', 'Todo', '/', 'TODO'],
        ['Task','/', 'In Progress', 'x', 'IN_PROGRESS'],
        ['Task','x', 'Done', ' ', 'DONE'],
    ];
    return importantCycle;
}

export function proCon() {
    const importantCycle: StatusCollection = [
        ['Task','P', 'Pro', 'C', 'NON_TASK'],
        ['Task','C', 'Con', 'P', 'NON_TASK'],
    ];
    return importantCycle;
}
