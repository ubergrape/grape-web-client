import React from 'react'
import {
  routes,
  Route,
  withRouter,
  ConnectedRouter,
} from 'grape-web/lib/router'

import { AppContainer } from '../../components/app-container'
import history from '../../app/history'
import RouteChanger from './RouteChanger'

const Container = withRouter(AppContainer)

const Router = ({ onChangeRoute, initialDataLoading, children }) => (
  <ConnectedRouter basename="/chat" history={history}>
    <Container>
      <Route
        path="/chat"
        exact
        render={({ location, match }) => (
          <RouteChanger
            name="root"
            location={location}
            params={match.params}
            isLoading={initialDataLoading}
            onChangeRoute={onChangeRoute}
          >
            {children}
          </RouteChanger>
        )}
      />
      <Route
        path={routes.pm}
        exact
        render={({ location, match }) => (
          <RouteChanger
            name="pm"
            location={location}
            params={match.params}
            isLoading={initialDataLoading}
            onChangeRoute={onChangeRoute}
          >
            {children}
          </RouteChanger>
        )}
      />
      <Route
        path={routes.channel}
        render={({ location, match }) => (
          <RouteChanger
            name="channel"
            location={location}
            params={match.params}
            isLoading={initialDataLoading}
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
