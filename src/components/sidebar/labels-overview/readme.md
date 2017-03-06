## Labels overview

```
const labels = [
  {
    id: '111111',
    type: 'todo',
    phrase: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
    color: '#F5A623',
    message: {
      author: {
        displayName: 'Felix'
      },
      channel: {
        name: 'Development'
      },
      time: new Date()
    }
  },
  {
    id: '22222',
    type: 'todo',
    phrase: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
    color: '#F5A623',
    message: {
      author: {
        displayName: 'Oleg'
      },
      channel: {
        name: 'Office'
      },
      time: new Date()
    }
  },
  {
    id: '333',
    type: 'question',
    phrase: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
    color: '#6252D5',
    message: {
      author: {
        displayName: 'Felix'
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
