## Basic

```
  const data = require('../../mocks/search').default
  const SearchBrowserProvider = require('../../containers/search-browser/SearchBrowserProvider').default

  const onChange = () => {
    setState({data})
  }

  ;<SearchBrowserProvider
    modal={false}
    onChange={onChange}
    data={state.data}
  />
```
