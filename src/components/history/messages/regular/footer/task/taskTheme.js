import { smallest, smaller, small, normal } from 'grape-theme/dist/fonts'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import {
  grayLight,
  grayLighter,
  grayBlueLighter,
  orange,
  green,
  white,
} from 'grape-theme/dist/base-colors'
import { icon as iconSize } from 'grape-theme/dist/sizes'
import color from 'color'

export const styles = {
  task: {
    position: 'relative',
    display: 'inline-block',
  },
  taskButton: {
    width: 'auto',
    height: 20,
    fontSize: small.fontSize,
    border: [
      1,
      'solid',
      color(grayLight)
        .alpha(0.5)
        .rgbaString(),
    ],
    borderRadius: 4,
    padding: [0, 5],
    backgroundColor: white,
    '&, *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  taskButtonIcon: {
    marginRight: 5,
  },
  taskButtonText: {
    extend: small,
    color: grayLight,
  },
  taskIconContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  taskIconLightningBolt: {
    fill: grayLight,
    height: small.fontSize,
  },
  taskIconLightningBoltConnected: {
    fill: orange,
  },
  taskIconCheckCircle: {
    position: 'absolute',
    left: 5,
    top: -3,
    fill: green,
    height: '0.8em',
  },
  iconButton: {
    width: iconSize.l,
    height: iconSize.l,
    '&, *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  iconButtonIcon: {
    fontSize: smaller.fontSize,
  },
  header: {
    position: 'relative',
    background: grayBlueLighter,
    padding: 10,
    display: 'flex',
    alignItems: 'flex-start',
  },
  headerTitle: {
    extend: [normal, ellipsis],
    fontWeight: 'bold',
    margin: 0,
    lineHeight: 1,
  },
  headerTitleIcon: {
    extend: small,
    marginRight: 5,
  },
  headerControlPrev: {
    marginRight: 10,
  },
  headerContent: {
    flex: 1,
  },
  headerControlClose: {
    width: iconSize.s,
    height: iconSize.s,
    '& $iconButtonIcon': {
      fontSize: smallest.fontSize,
    },
  },
  headerDescr: {
    extend: [small, ellipsis],
    margin: 0,
  },
  tasksListView: {
    width: 260,
  },
  tasksList: {
    padding: 0,
  },
  tasksListItem: {
    padding: [5, 10],
    borderTop: [2, 'solid', grayBlueLighter],
    '&:hover': {
      background: grayLighter,
    },
    '&, *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  tasksListItemIcon: {},
  tasksListItemTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    height: smaller.lineHeight * smaller.fontSize * 2,
    padding: [0, 10],
  },
  tasksListItemText: {
    extend: [smaller, ellipsis],
    display: 'inline-block',
    whiteSpace: 'pre-line',
  },
}
