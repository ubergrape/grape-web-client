## Labels overview

```
const labels = [
  {
    id: '111111',
    name: 'todo',
    nameLocalized: 'Tasks',
    phrase: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
    color: '#F5A623',
    message: {
      author: {
        name: 'Felix'
      },
      channel: {
        name: 'Development'
      },
      time: new Date()
    }
  },
  {
    id: '22222',
    name: 'todo',
    nameLocalized: 'Tasks',
    phrase: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
    color: '#F5A623',
    message: {
      author: {
        name: 'Oleg'
      },
      channel: {
        name: 'Office'
      },
      time: new Date()
    }
  },
  {
    id: '333',
    name: 'question',
    nameLocalized: 'Question',
    phrase: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
    color: '#6252D5',
    message: {
      author: {
        name: 'Felix'
      },
      channel: {
        name: 'Office'
      },
      time: new Date(new Date().setMonth(new Date().getMonth() - 1))
    }
  }
];
<div style={{height: 300}}>
  <LabelsOverview labels={labels} />
</div>
```

## Labels overview empty state

```
<div style={{height: 300}}>
  <LabelsOverview />
</div>
```
