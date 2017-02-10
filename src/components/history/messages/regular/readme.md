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
<div style={{marginBottom: 50}}>
  <RegularMessage nlp={{amount: 3}}>
    Hello
  </RegularMessage>
</div>
```

### Connected state

```
<div style={{marginBottom: 50}}>
  <RegularMessage nlp={{amount: 3, isConnected: true}}>
    Hello
  </RegularMessage>
</div>
```
