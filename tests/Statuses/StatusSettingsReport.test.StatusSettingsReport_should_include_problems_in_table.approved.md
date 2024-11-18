| Object Class of Status | Status Symbol | Next Status Symbol | Status Name | Status Stage | Problems (if any) |
| ----- | ----- | ----- | ----- | ----- | ----- |
| Task | `space` | `x` | Todo | `TODO` |  |
| Task | `x` | `space` | Done | `DONE` |  |
| Task | `/` | `x` | In Progress | `IN_PROGRESS` |  |
| Task | `/` | `x` | In Progress DUPLICATE | `IN_PROGRESS` | Duplicate symbol '`/`': this status will be ignored. |
| Task | `X` | `space` | X - conventionally DONE, but this is CANCELLED | `CANCELLED` | For information, the conventional stage for status symbol `X` is `DONE`: you may wish to review this stage. |
| Task |  |  |  | `TODO` | Empty symbol: this status will be ignored. |
| Task | `p` | `q` | Unknown next symbol | `TODO` | Next symbol `q` is unknown: create a status with symbol `q`. |
| Task | `c` | `d` | Followed by d | `TODO` | Next symbol `d` is unknown: create a status with symbol `d`. |
| Task | `n` | `n` | Non-task | `NON_TASK` |  |
| Task | `1` | `space` | DONE followed by TODO | `DONE` |  |
| Task | `2` | `/` | DONE followed by IN_PROGRESS | `DONE` |  |
| Task | `3` | `x` | DONE followed by DONE | `DONE` | This `DONE` status is followed by `DONE`, not `TODO` or `IN_PROGRESS`.<br>If used to complete a recurring task, it will instead be followed by `TODO` or `IN_PROGRESS`, to ensure the next task matches the `not done` filter.<br>See [Recurring Tasks and Custom Statuses](https://publish.obsidian.md/tasks/Getting+Started/Statuses/Recurring+Tasks+and+Custom+Statuses). |
| Task | `4` | `X` | DONE followed by CANCELLED | `DONE` | This `DONE` status is followed by `CANCELLED`, not `TODO` or `IN_PROGRESS`.<br>If used to complete a recurring task, it will instead be followed by `TODO` or `IN_PROGRESS`, to ensure the next task matches the `not done` filter.<br>See [Recurring Tasks and Custom Statuses](https://publish.obsidian.md/tasks/Getting+Started/Statuses/Recurring+Tasks+and+Custom+Statuses). |
| Task | `5` | `n` | DONE followed by NON_TASK | `DONE` | This `DONE` status is followed by `NON_TASK`, not `TODO` or `IN_PROGRESS`.<br>If used to complete a recurring task, it will instead be followed by `TODO` or `IN_PROGRESS`, to ensure the next task matches the `not done` filter.<br>See [Recurring Tasks and Custom Statuses](https://publish.obsidian.md/tasks/Getting+Started/Statuses/Recurring+Tasks+and+Custom+Statuses). |
