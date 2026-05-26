import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Rendering error caught by ErrorBoundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-main">
          <div className="card">
            <h2>Something went wrong :(</h2>
            <p>Please make a bug report to mluukkai in Discord.</p>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
