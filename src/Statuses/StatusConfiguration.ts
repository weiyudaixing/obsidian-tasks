/**
 * Collection of status stages supported by the plugin.
 */
export enum StatusStage {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    ARCHIVED = 'ARCHIVED',
    CANCELLED = 'CANCELLED',
    HOOK = 'HOOK',
    NON_TASK = 'NON_TASK',
    EMPTY = 'EMPTY',
}

/**
 * This is the object stored by the Obsidian configuration and used to create the status
 * objects for the session
 *
 * @export
 * @class StatusConfiguration
 */
export class StatusConfiguration {
    /**
     * The class of the task object, e.g. task, question.
     *
     * @type {string}
     * @memberof Status
     */
    public readonly objectClass: string;

    /**
     * The character used between the two square brackets in the markdown task.
     *
     * @type {string}
     * @memberof Status
     */
    public readonly symbol: string;

    /**
     * Returns the name of the status for display purposes.
     *
     * @type {string}
     * @memberof Status
     */
    public readonly name: string;

    /**
     * Returns the next status for a task when toggled.
     *
     * @type {string}
     * @memberof Status
     */
    public readonly nextStatusSymbol: string;

    /**
     * If true then it is registered as a command that the user can map to.
     *
     * @type {boolean}
     * @memberof Status
     */
    public readonly availableAsCommand: boolean;

    /**
     * Returns the status stage. See {@link StatusStage} for details.
     */
    public readonly stage: StatusStage;

    /**
     * Creates an instance of Status. The registry will be added later in the case
     * of the default statuses.
     * @param {string} objectClass
     * @param {string} symbol
     * @param {string} name
     * @param {Status} nextStatusSymbol
     * @param {boolean} availableAsCommand
     * @param {StatusStage} stage
     * @memberof Status
     */
    constructor(
        objectClass: string,
        symbol: string,
        name: string,
        nextStatusSymbol: string,
        availableAsCommand: boolean,
        stage: StatusStage = StatusStage.TODO, // TODO Remove default value
    ) {
        this.objectClass = objectClass;
        this.symbol = symbol;
        this.name = name;
        this.nextStatusSymbol = nextStatusSymbol;
        this.availableAsCommand = availableAsCommand;
        this.stage = stage;
    }
}
