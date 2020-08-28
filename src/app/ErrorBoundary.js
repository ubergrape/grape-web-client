import React from 'react'
import Raven from 'raven-js'
import { isElectron } from 'grape-web/lib/x-platform/electron'

/*
 * This ErrorBoundary is the absolute last resort in case something goes wrong.
 *
 * We use inline styles to avoid any errors coming from JSS. In addtion this is
 * not translatted since at this point the user settings are not know.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true })
    // eslint-disable-next-line no-console
    Raven.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            padding: 18,
          }}
        >
          <h1
            style={{
              fontFamily:
                "noto-sans, 'Helvetica Neue', Arial, Helvetica, sans-serif",
              fontSize: 17,
            }}
          >
            Something went wrong. Our team has been notified.
            {isElectron ? ' Please restart Grape.' : ' Please reload the page.'}
          </h1>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
