import type { Task } from '../../Task/Task';
import { TextField } from './TextField';

/**
 * A {@link Field} implementation for searching status.objectclass
 */
export class StatusObjectClassField extends TextField {
    constructor() {
        super();
    }

    public fieldName(): string {
        return 'status.objectClass';
    }

    value(task: Task): string {
        return task.status.objectClass;
    }

    supportsSorting(): boolean {
        return true;
    }

    public supportsGrouping(): boolean {
        return true;
    }
}
