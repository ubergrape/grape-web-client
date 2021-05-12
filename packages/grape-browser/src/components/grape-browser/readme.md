## Grape Browser main component

```
const mentions = require('./tests/mocks/data1.json')

const onComplete = ({trigger}) => {
  switch (trigger) {
    case '@':
      setState({data: mentions, browser: 'user'})
      break
  }
}

;<GrapeBrowser {...state} onComplete={onComplete}/>
```
