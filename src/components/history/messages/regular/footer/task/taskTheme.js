import {smaller, small, normal} from 'grape-theme/dist/fonts'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {
  grayLight, grayLighter, grayBlueLighter, orange, green, white
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
    marginRight: 10
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
    fill: grayLight,
    height: '1.2em'
  },
  taskIconLightningBoltConnected: {
    fill: orange
  },
  taskIconCheckCircle: {
    position: 'absolute',
    left: '0.45em',
    top: 0,
    fill: green,
    height: '0.8em'
  },
  iconButtonIcon: {
    fontSize: smaller.fontSize
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
  section: {
    background: white,
    borderTop: [2, 'solid', grayBlueLighter],
    width: 260
  },
  tasksList: {

  },
  tasksListItem: {
    display: 'flex',
    padding: 10,
    cursor: 'pointer',
    '&:hover': {
      background: grayLighter
    }
  },
  taskListItemIcon: {
    cursor: 'pointer'
  },
  tasksListItemText: {
    extend: [small, ellipsis],
    flex: 1,
    maxHeight: small.lineHeight * small.fontSize * 2,
    whiteSpace: 'pre-line',
    padding: [0, 10],
    cursor: 'pointer'
  }
}
