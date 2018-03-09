import React from 'react'
import ConnectedRouter from 'react-router-redux/ConnectedRouter'
import {channel, pm, Route, withRouter} from 'grape-web/lib/router'

import {AppContainer} from '../../components/app-container'
import history from '../../app/history'
import RouteChanger from './RouteChanger'

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
