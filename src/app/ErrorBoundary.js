import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
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
                "proxima-nova, 'Helvetica Neue', Arial, Helvetica, sans-serif",
              fontSize: 18,
            }}
          >
            Something went wrong. Please contact us at support@chatgrape.com
          </h1>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
