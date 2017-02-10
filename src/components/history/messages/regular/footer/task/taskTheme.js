import {smaller, small, normal} from 'grape-theme/dist/fonts'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {
  grayLight, grayBlueLighter, orange, green, white
} from 'grape-theme/dist/base-colors'

export const styles = {
  task: {
    position: 'relative',
    display: 'inline-block'
  },
  taskButton: {
    backgroundColor: white
  },
  taskButtonIcon: {
    marginRight: 5,
    fill: grayLight
  },
  taskButtonText: {
    color: grayLight
  },
  taskButtonIconConnected: {
    fill: orange,
    marginRight: 3
  },
  taskButtonIconConnectedCheckmark: {
    fill: green,
    height: '0.8em',
    margin: {
      top: '-1em',
      left: '-0.4em'
    }
  },
  content: {
    width: 260
  },
  header: {
    position: 'relative',
    background: grayBlueLighter,
    padding: 10,
    display: 'flex',
    alignItems: 'flex-start'
  },
  headerTitle: {
    extend: [normal, ellipsis],
    fontWeight: 'bold',
    margin: 0,
    lineHeight: 1
  },
  headerTitleIcon: {
    extend: small,
    marginRight: 5
  },
  headerControl: {

  },
  headerControlIcon: {
    fontSize: smaller.fontSize
  },
  headerControlPrev: {
    marginRight: 10
  },
  headerContent: {
    flex: 1
  },
  headerControlClose: {
    marginLeft: 10
  },
  headerDescr: {
    extend: [small, ellipsis],
    margin: 0
  },
  body: {
    background: white,
    padding: 10,
    borderTop: [2, 'solid', grayBlueLighter]
  }
}
