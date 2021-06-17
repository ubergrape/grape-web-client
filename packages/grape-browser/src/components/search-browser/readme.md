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

  const onLoadServicesStats = (query) => {
    setState({servicesStats: data.servicesStats})
  }

  ;<SearchBrowserProvider
    modal={false}
    onChange={onChange}
    onLoadServices={onLoadServices}
    onLoadServicesStats={onLoadServicesStats}
    data={state.data}
    services={state.services}
    servicesStats={state.servicesStats}
  />
```
