## Intro

### Clickable step 0

```
initialState = {step: 0, show: true}

const onNext = () => {
  setState({step: state.step + 1})
}

const onClose = () => {
  setState({show: false})
};

<div style={{minHeight: 400}}>
  {state.show && (
    <Intro step={state.step} onNext={onNext} onSkip={onClose} onDone={onClose}/>
  )}
</div>
```

### Step 1

```
<div style={{minHeight: 400}}>
  <Intro step={1} />
</div>
```

### Step 2

TODO new conversation dialog

### Step 3

```
<div style={{minHeight: 400}}>
  <Intro step={3} />
</div>
```

### Step 4

```
<div style={{minHeight: 400}}>
  <Intro step={4} />
</div>
```

### Step 5

```
<div style={{minHeight: 400}}>
  <Intro step={5} />
</div>
```
