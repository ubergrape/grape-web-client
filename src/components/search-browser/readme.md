## Basic

```
  const data = require('../../../mocks/search').default
  const SearchBrowserProvider = require('../../containers/search-browser/SearchBrowserProvider').default

  initialState = {
    services: []
  }

  const onChange = () => {
    setState({data})
  }

  const onLoadServices = () => {
    setState({services: data.services})
  }

  ;<SearchBrowserProvider
    modal={false}
    onChange={onChange}
    onLoadServices={onLoadServices}
    data={state.data}
    services={state.services}
  />
```
