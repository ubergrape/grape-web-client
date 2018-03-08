import React from 'react'
import {Route, withRouter} from 'react-router-dom'
import ConnectedRouter from 'react-router-redux/ConnectedRouter'

import {AppContainer} from '../../components/app-container'
import history from '../../app/history'
import RouteChanger from './RouteChanger'
import {channel, pm} from '../../constants/routes'

const Container = withRouter(AppContainer)

const Router = ({onChangeRoute, children}) => (
  <ConnectedRouter
    basename={'/chat'}
    history={history}
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
        path={pm}
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
        path={channel}
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
