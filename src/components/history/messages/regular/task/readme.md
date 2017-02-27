## Task

```
const tasks = [
  {text: 'Task 1'},
  {text: 'Task 2, Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.', isConnected: true},
  {text: 'Task 3'}
];

const services = [
  {id: 'github', name: 'Github'},
  {id: 'trello', name: 'Trello'},
  {id: 'asana', name: 'Asana'}
];

<div style={{marginTop: 300, marginBottom: 30}}>
  <Tasks tasks={tasks} services={services} isConnected />
</div>
```
