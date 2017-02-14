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
  taskIconContainer: {
    position: 'relative',
    display: 'inline-block',
    paddingTop: 4
  },
  taskIconLightningBolt: {
    fill: orange,
    marginRight: 10,
    height: '1.2em'
  },
  taskIconCheckCircle: {
    position: 'absolute',
    left: '0.45em',
    top: 0,
    fill: green,
    height: '0.8em'
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
