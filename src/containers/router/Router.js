import React from 'react'
import {Route, withRouter} from 'react-router-dom'
import ConnectedRouter from 'react-router-redux/ConnectedRouter'

import {AppContainer} from '../../components/app-container'
import history from '../../app/history'
import RouteChanger from './RouteChanger'
import {channelRoute, pmRoute} from '../../constants/routes'
import getBoundActions from '../../app/boundActions'

const Container = withRouter(AppContainer)

const fakeHistory = {
  ...history,
  push: (url) => { getBoundActions().goTo(url) },
  replace: (url) => { getBoundActions().goTo(url, {replace: true}) }
}

const Router = ({onChangeRoute, children}) => (
  <ConnectedRouter
    basename={'/chat'}
    history={fakeHistory}
  >
    <Container>
      <Route
        path="/chat"
        exact
        render={({location, match}) => (
          <RouteChanger
            name="root"
            location={location}
            params={match.params}
            onChangeRoute={onChangeRoute}
          >
            {children}
          </RouteChanger>
        )}
      />
      <Route
        path={pmRoute}
        exact
        render={({location, match}) => (
          <RouteChanger
            name="pm"
            location={location}
            params={match.params}
            onChangeRoute={onChangeRoute}
          >
            {children}
          </RouteChanger>
        )}
      />
      <Route
        path={channelRoute}
        render={({location, match}) => (
          <RouteChanger
            name="channel"
            location={location}
            params={match.params}
            onChangeRoute={onChangeRoute}
          >
            {children}
          </RouteChanger>
        )}
      />
    </Container>
  </ConnectedRouter>
)

export default Router
