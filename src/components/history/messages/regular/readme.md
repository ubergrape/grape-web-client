## Basic regular message

```
<div style={{marginTop: 50}}>
  <RegularMessage>Hello World!</RegularMessage>
</div>
```

## Message with all supported markdown tags and emojis

````
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
````

## Message with task button

```
<div>
  <div style={{marginBottom: 10}}>
    <RegularMessage nlp={{tasks: new Array(3)}}>
      With disconnected task button.
    </RegularMessage>
  </div>

  <div style={{marginBottom: 30}}>
    <RegularMessage nlp={{tasks: new Array(4), isConnected: true}}>
      With connected task button.
    </RegularMessage>
  </div>
</div>
```
