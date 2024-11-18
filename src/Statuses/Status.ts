import { StatusConfiguration, StatusStage } from './StatusConfiguration';
import type { StatusCollectionEntry } from './StatusCollection';

/**
 * Tracks the possible states that a task can be in.
 *
 * Related classes:
 * @see StatusConfiguration
 * @see StatusRegistry
 * @see StatusSettings
 * @see StatusSettingsHelpers.ts
 * @see CustomStatusModal
 *
 * @export
 * @class Status
 */
export class Status {
    /**
     * The default Done status. Goes to Todo when toggled.
     *
     * @static
     * @type {Status}
     * @memberof Status
     */
    public static readonly DONE: Status = new Status(new StatusConfiguration('Task', 'x', 'Done', ' ', true, StatusStage.DONE));

    /**
     * A default status of empty, used when things go wrong.
     *
     * @static
     * @type {Status}
     * @memberof Status
     */
    public static readonly EMPTY: Status = new Status(new StatusConfiguration('Task','', 'EMPTY', '', true, StatusStage.EMPTY));

    /**
     * The default Todo status. Goes to Done when toggled.
     * User may later be able to override this to go to In Progress instead.
     *
     * @static
     * @type {Status}
     * @memberof Status
     */
    public static readonly TODO: Status = new Status(new StatusConfiguration('Task',' ', 'Todo', 'x', true, StatusStage.TODO));

    /**
     * The default Cancelled status. Goes to Todo when toggled.
     *
     * @static
     * @type {Status}
     * @memberof Status
     */
    public static readonly CANCELLED: Status = new Status(
        new StatusConfiguration('Task','-', 'Cancelled', ' ', true, StatusStage.CANCELLED),
    );

    /**
     * The default In Progress status. Goes to Done when toggled.
     *
     * @static
     * @type {Status}
     * @memberof Status
     */
    public static readonly IN_PROGRESS: Status = new Status(
        new StatusConfiguration('Task','/', 'In Progress', 'x', true, StatusStage.IN_PROGRESS),
    );

    /**
     * A sample Non-Task status. Goes to NON_TASK when toggled.
     *
     * @static
     * @type {Status}
     * @memberof Status
     */
    public static readonly NON_TASK: Status = new Status(
        new StatusConfiguration('Question','Q', 'Non-Task', 'A', true, StatusStage.TODO),
    );

    /**
     * A sample Archived status. Goes to ARCHIVED when toggled.
     *
     * @static
     * @type {Status}
     * @memberof Status
     */
    public static readonly ARCHIVED: Status = new Status(
        new StatusConfiguration('Question','A', 'Answered', 'Q', true, StatusStage.DONE),
    );

    /**
     * A sample Hook status. Goes to HOOK when toggled.
     *
     * @static
     * @type {Status}
     * @memberof Status
     */
    public static readonly HOOK: Status = new Status(
        new StatusConfiguration('Question','D', 'Hook', 'D', true, StatusStage.HOOK),
    );

    /**
     * The configuration stored in the data.json file.
     *
     * @type {StatusConfiguration}
     * @memberof Status
     */
    public readonly configuration: StatusConfiguration;
    
     /**
     * The class of the task object, e.g. task, question.
     *
     * @type {string}
     * @memberof Status
     */
     public get objectClass(): string {
        return this.configuration.objectClass;
    }

    /**
     * The symbol used between the two square brackets in the markdown task.
     *
     * @type {string}
     * @memberof Status
     */
    public get symbol(): string {
        return this.configuration.symbol;
    }

    /**
     * Returns the name of the status for display purposes.
     *
     * @type {string}
     * @memberof Status
     */
    public get name(): string {
        return this.configuration.name;
    }

    /**
     * Returns the next status for a task when toggled.
     *
     * @type {string}
     * @memberof Status
     * @see nextSymbol
     */
    public get nextStatusSymbol(): string {
        return this.configuration.nextStatusSymbol;
    }

    /**
     * Returns the next status for a task when toggled.
     * This is an alias for {@link nextStatusSymbol} which is provided for brevity in user scripts.
     *
     * @type {string}
     * @memberof Status
     * @see nextStatusSymbol
     */
    public get nextSymbol(): string {
        return this.configuration.nextStatusSymbol;
    }

    /**
     * If true then it is registered as a command that the user can map to.
     *
     * @type {boolean}
     * @memberof Status
     */
    public get availableAsCommand(): boolean {
        return this.configuration.availableAsCommand;
    }

    /**
     * Returns the status stage. See {@link StatusStage} for details.
     */
    public get stage(): StatusStage {
        return this.configuration.stage;
    }

    /**
     * Returns the text to be used to represent the {@link StatusStage} in group headings.
     *
     * The status stages are in the same order as given by 'group by status.stage'.
     * This is provided as a convenience for use in custom grouping.
     */
    public get stageGroupText(): string {
        const stage = this.stage;
        let prefix: string;
        // Add a numeric prefix to sort in to a meaningful order for users
        switch (stage) {
            case StatusStage.IN_PROGRESS:
                prefix = '1';
                break;
            case StatusStage.TODO:
                prefix = '2';
                break;
            case StatusStage.DONE:
                prefix = '3';
                break;
            case StatusStage.ARCHIVED:
                prefix = '4';
                break;
            case StatusStage.CANCELLED:
                prefix = '5';
                break;
            case StatusStage.HOOK:
                prefix = '6';
                break;
            case StatusStage.NON_TASK:
                prefix = '7';
                break;
            case StatusStage.EMPTY:
                prefix = '8';
                break;
        }
        // Text inside the %%..%% comments is used to control the sorting in both sorting of tasks and naming of groups.
        // The comments are hidden by Obsidian when the headings are rendered.
        return `%%${prefix}%%${stage}`;
    }

    /**
     * Creates an instance of Status. The registry will be added later in the case
     * of the default statuses.
     *
     * @param {StatusConfiguration} configuration
     * @memberof Status
     */
    constructor(configuration: StatusConfiguration) {
        this.configuration = configuration;
    }

    /**
     * Return the StatusStage to use for a symbol, if it is not in the StatusRegistry.
     * The core symbols are recognised.
     * Other symbols are treated as StatusStage.TODO
     * @param symbol
     */
    static getStageForUnknownSymbol(symbol: string): StatusStage {
        switch (symbol) {
            case 'x':
            case 'X':
                return StatusStage.DONE;
            case '/':
                return StatusStage.IN_PROGRESS;
            case '-':
                return StatusStage.CANCELLED;
            case '':
                return StatusStage.EMPTY;
            case 'N':
                return StatusStage.ARCHIVED;
            case ' ':
            default:
                return StatusStage.TODO;
        }
    }

    /**
     * Convert text that was saved from a StatusStage value back to a StatusStage.
     * Returns StatusStage.TODO if the string is not valid.
     * @param statusStageAsString
     */
    static getStageFromStatusStageString(statusStageAsString: string): StatusStage {
        return StatusStage[statusStageAsString as keyof typeof StatusStage] || StatusStage.TODO;
    }

    /**
     * Create a Status representing the given, unknown symbol.
     *
     * This can be useful when StatusRegistry does not recognise a symbol,
     * and we do not want to expose the user's data to the Status.EMPTY status.
     *
     * The stage is set to TODO.
     * @param unknownSymbol
     */
    static createUnknownStatus(unknownSymbol: string) {
        return new Status(new StatusConfiguration('Unknown', unknownSymbol, 'Unknown', 'x', false, StatusStage.TODO));
    }

    /**
     * Helper function for bulk-importing settings from arrays of strings.
     *
     * @param imported An array of symbol, name, next symbol, status stage
     */
    static createFromImportedValue(imported: StatusCollectionEntry) {
        const symbol = imported[1];
        const stage = Status.getStageFromStatusStageString(imported[4]);
        return new Status(new StatusConfiguration(imported[0], symbol, imported[2], imported[3], false, stage));
    }

    /**
     * Returns the onhook status for a task, this is only supported
     * when the task is done/x.
     *
     * @return {*}  {boolean}
     * @memberof Status
     */
    public isCompleted(): boolean {
        return this.stage === StatusStage.DONE;
    }

     /**
     * Returns the Archived status for a task, this is only supported
     * when the task is archived/x.
     *
     * @return {*}  {boolean}
     * @memberof Status
     */
     public isArchived(): boolean {
        return this.stage === StatusStage.ARCHIVED;
    }

    /**
     * Whether the task status stage is {@link CANCELLED}.
     */
    public isCancelled(): boolean {
        return this.stage === StatusStage.CANCELLED;
    }

    /**
     * Compare all the fields in another Status, to detect any differences from this one.
     *
     * If any field is different in any way, it will return false.
     *
     * @param other
     */
    public identicalTo(other: Status): boolean {
        const args: Array<keyof StatusConfiguration> = [
            'objectClass',
            'symbol',
            'name',
            'nextStatusSymbol',
            'availableAsCommand',
            'stage',
        ];
        for (const el of args) {
            if (this[el] !== other[el]) return false;
        }
        return true;
    }

    /**
     * Return a one-line summary of the status, for presentation to users.
     */
    public previewText() {
        let commandNotice = '';
        if (Status.tasksPluginCanCreateCommandsForStatuses() && this.availableAsCommand) {
            commandNotice = ' Available as a command.';
        }
        return (
            `- [${this.symbol}]` + // comment to break line
            ` => [${this.nextStatusSymbol}],` +
            ` name: '${this.name}',` +
            ` stage: '${this.configuration.stage}'.` +
            `${commandNotice}`
        );
    }

    /**
     * Whether Tasks can yet create 'Toggle Status' commands for statuses
     *
     * This is not yet possible, and so some UI features are temporarily hidden.
     * See https://github.com/obsidian-tasks-group/obsidian-tasks/issues/1486
     * Once that issue is addressed, this method can be removed.
     */
    public static tasksPluginCanCreateCommandsForStatuses(): boolean {
        return false;
    }
}
