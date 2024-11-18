<!-- placeholder to force blank line before included text -->


```javascript
filter by function task.status.stage === 'NON_TASK'
```

- Find tasks of stage `NON_TASK`.

```javascript
filter by function 'TODO,IN_PROGRESS'.includes(task.status.stage)
```

- Find tasks that are either stage `TODO` or stage `IN_PROGRESS`.
- This can be more convenient than doing Boolean `OR` searches.

```javascript
filter by function ! 'NON_TASK,CANCELLED'.includes(task.status.stage)
```

- Find tasks that are not stage `NON_TASK` and not stage `CANCELLED`.


<!-- placeholder to force blank line after included text -->
