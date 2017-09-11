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

```
<div style={{minHeight: 400}}>
  Some test <Beacon id="manageGroups" placement="bottom" />
  <Intro step={2} />
</div>
```

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
