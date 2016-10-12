import button from '../../button/link'

export const maxHeight = 350

const panel = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  textAlign: 'center'
}

export const styles = {
  expandedExpander: {
    paddingBottom: 15
  },
  collapsedExpander: {
    overflow: 'hidden',
    maxHeight
  },
  collapsedPanel: {
    extend: panel,
    paddingTop: 50,
    // FIXME use grape-theme
    background: 'linear-gradient(to bottom, rgba(237, 240, 245, 0) 0%, #edf0f5 70%)',
    fallbacks: {
      background: '#edf0f5'
    }
  },
  expandedPanel: panel,
  button
}
