<!-- placeholder to force blank line before included text -->

| Operation and status.stage | TODO | IN_PROGRESS | DONE | CANCELLED | NON_TASK |
| ----- | ----- | ----- | ----- | ----- | ----- |
| Example Task | `- [ ] demo` | `- [/] demo` | `- [x] demo` | `- [-] demo` | `- [~] demo` |
| Matches `not done` | YES | YES | no | no | no |
| Matches `done` | no | no | YES | YES | YES |
| Matches `status.stage is TODO` | YES | no | no | no | no |
| Matches `status.stage is IN_PROGRESS` | no | YES | no | no | no |
| Matches `status.stage is DONE` | no | no | YES | no | no |
| Matches `status.stage is CANCELLED` | no | no | no | YES | no |
| Matches `status.stage is NON_TASK` | no | no | no | no | YES |
| Matches `status.name includes todo` | YES | no | no | no | no |
| Matches `status.name includes in progress` | no | YES | no | no | no |
| Matches `status.name includes done` | no | no | YES | no | no |
| Matches `status.name includes cancelled` | no | no | no | YES | no |
| Name for `group by status` | Todo | Todo | Done | Done | Done |
| Name for `group by status.stage` | %%2%%TODO | %%1%%IN_PROGRESS | %%3%%DONE | %%5%%CANCELLED | %%6%%NON_TASK |
| Name for `group by status.name` | Todo | In Progress | Done | Cancelled | My custom status |


<!-- placeholder to force blank line after included text -->