import { StatusStage } from '../Statuses/StatusConfiguration';
import type { Task } from './Task';

export enum OnHook {
    Ignore = '',
    Keep = 'keep', // Like Ignore, but is visible on task lines
    Delete = 'delete',
}

export function parseOnHookValue(inputOnHookValue: string) {
    const onHookString = inputOnHookValue.trim().toLowerCase();
    if (onHookString === 'delete') {
        return OnHook.Delete;
    } else if (onHookString === 'keep') {
        return OnHook.Keep;
    } else {
        return OnHook.Ignore;
    }
}

function returnWithoutHookedInstance(tasks: Task[], changedStatusTask: Task) {
    return tasks.filter((task) => task !== changedStatusTask);
}

function keepTasks(originalTask: Task, changedStatusTask: Task) {
    const startStatus = originalTask.status;
    const endStatus = changedStatusTask.status;

    const statusDidNotChange = endStatus.stage === startStatus.stage;
    const endStatusIsNotHook = endStatus.stage !== StatusStage.HOOK;

    return endStatusIsNotHook || statusDidNotChange;
}

export function handleOnHook(originalTask: Task, newTasks: Task[]): Task[] {
    const tasksArrayLength = newTasks.length;
    if (
        originalTask.onHook === OnHook.Ignore ||
        originalTask.onHook === OnHook.Keep ||
        tasksArrayLength === 0
    ) {
        return newTasks;
    }
    const changedStatusTask = newTasks[tasksArrayLength - 1];
    const keepAllTasks = keepTasks(originalTask, changedStatusTask);
    if (keepAllTasks) {
        return newTasks;
    }

    const ocAction: OnHook = originalTask.onHook;

    if (ocAction === OnHook.Delete) {
        return returnWithoutHookedInstance(newTasks, changedStatusTask);
    }

    // We will only reach here when adding a new option to OnHook, and before
    // the handler code has been added. This is expected to be found in tests.
    console.log(`OnHook action ${ocAction} not yet implemented.`);

    return newTasks;
}
