## Basic regular message

```
<div style={{marginTop: 50}}>
  <RegularMessage>Hello World!</RegularMessage>
</div>
```

## Message with all supported markdown tags and emojis

```
<div>
  <RegularMessage>
    :)
  </RegularMessage>
  <RegularMessage>
    :thumbsup:
  </RegularMessage>
  <RegularMessage>
    __bold__
  </RegularMessage>
  <RegularMessage>
    *italic*
  </RegularMessage>
  <RegularMessage>
    ~~strikethrough~~
  </RegularMessage>
  <RegularMessage>
    `code`
  </RegularMessage>
  <RegularMessage>
    ```
    multiline code
    ```
  </RegularMessage>
  <RegularMessage>
    [link](http://markdownlink.com)
  </RegularMessage>
  <RegularMessage>
    > quote
  </RegularMessage>
  <RegularMessage>
    1. test
  </RegularMessage>
</div>
```

## Message with task button

### Disconnected state

```
<div style={{marginTop: 100, marginBottom: 30}}>
  <RegularMessage nlp={{amount: 3, items:[{text: 'Task 1'}, {text: 'Task 2'}]}}>
    With disconnected task button.
  </RegularMessage>
</div>
```

### Connected state

```
<div style={{marginTop: 150, marginBottom: 30}}>
  <RegularMessage nlp={{amount: 3, isConnected: true, items:[{text: 'Task 1'}, {text: 'Task 2'}]}}>
    With connected task button.
  </RegularMessage>
</div>
```
