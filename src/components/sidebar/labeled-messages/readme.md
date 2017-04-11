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
        color: 'red',
        nameLocalized: 'Task'
      },
      {
        color: 'green',
        nameLocalized: 'Question'
      },
      {
        color: 'green',
        nameLocalized: 'Question1'
      },
      {
        color: 'green',
        nameLocalized: 'Question2'
      },
      {
        color: 'green',
        nameLocalized: 'Question3'
      },
      {
        color: 'green',
        nameLocalized: 'Question4'
      },
      {
        color: 'green',
        nameLocalized: 'Question5'
      },
      {
        color: 'green',
        nameLocalized: 'Question6'
      },
      {
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

## Labels overview empty state

```
<div style={{height: 300}} >
  <LabeledMessages />
</div>
```
