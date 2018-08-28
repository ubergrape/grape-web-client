## Labeled messages

```
const messages = [
  {
    author: {
      name: 'Felix'
    },
    channel: {
      name: 'Development'
    },
    id: '111111',
    labels: [
      {
        id: '111',
        color: 'red',
        nameLocalized: 'Question'
      }
    ],
    text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
    time: new Date()
  },
  {
    author: {
      name: 'Oleg'
    },
    channel: {
      name: 'Development'
    },
    id: '222',
    labels: [
      {
        id: '111',
        color: 'red',
        nameLocalized: 'Task'
      },
      {
        id: '222',
        color: 'green',
        nameLocalized: 'Question'
      },
      {
        id: '333',
        color: 'green',
        nameLocalized: 'Question1'
      },
      {
        id: '444',
        color: 'green',
        nameLocalized: 'Question2'
      },
      {
        id: '555',
        color: 'green',
        nameLocalized: 'Question3'
      },
      {
        id: '666',
        color: 'green',
        nameLocalized: 'Question4'
      },
      {
        id: '777',
        color: 'green',
        nameLocalized: 'Question5'
      },
      {
        id: '888',
        color: 'green',
        nameLocalized: 'Question6'
      },
      {
        id: '999',
        color: 'green',
        nameLocalized: 'Question7'
      }
    ],
    text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
    time: new Date()
  },
  {
    author: {
      name: 'Felix'
    },
    channel: {
      name: 'Development'
    },
    id: '3333',
    labels: [
      {
        id: '111',
        color: 'red',
        nameLocalized: 'Question'
      }
    ],
    text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
    time: new Date()
  },
];
<div style={{height: 300}}>
  <LabeledMessages messages={messages} />
</div>
```

## Labeled messages empty state

```
<div style={{height: 300}} >
  <LabeledMessages />
</div>
```
