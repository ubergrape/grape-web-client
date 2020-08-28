import { has } from 'lodash'
import { white } from 'grape-theme/dist/base-colors'
import { zIndex } from '../../../utils/z-index'

export default () => ({
  windowWrapper: {
    position: 'absolute',
    padding: 10,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  window: {
    width: 360,
    height: 80,
    cursor: 'move',
    background: '#333',
    borderRadius: 16,
    position: 'absolute',
    zIndex: zIndex('alerts', 1),
    top: 76,
    right: 20,
    boxShadow: '0px 0px 3px 0px rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginLeft: 8,
    cursor: 'move',
    display: 'block',
    position: 'relative',
  },
  image: {
    cursor: 'move',
    height: 64,
    width: 64,
    borderRadius: '50%',
  },
  channelIconWrapper: {
    backgroundColor: ({ callStatus }) =>
      has(callStatus, 'data.channel.color')
        ? callStatus.data.channel.color
        : null,
    cursor: 'move',
    color: white,
    height: 64,
    width: 64,
    borderRadius: '50%',
  },
  channelIcon: {
    isolate: false,
    width: '100%',
    height: '100%',
  },
  cameraIconWrapper: {
    cursor: 'move',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 3,
    bottom: 3,
    width: 20,
    height: 20,
    backgroundColor: '#333',
    borderRadius: '50%',
  },
  cameraIcon: {
    cursor: 'move',
    color: '#FFF',
    width: 14,
    height: 11,
  },
  details: {
    cursor: 'move',
    margin: '0 16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    cursor: 'move',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 600,
    lineHeight: '25px',
    fontSize: 15,
    color: '#FFF',
  },
  time: {
    cursor: 'move',
    fontSize: 13,
    lineHeight: '25px',
    color: '#FFF',
  },
  button: {
    width: 48,
    height: 48,
    marginLeft: 'auto',
    marginRight: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '50%',
  },
  cancel: {
    background: '#D4210A',
  },
  missedIcon: {
    color: '#FFF',
    width: 32,
    height: 12,
    pointerEvents: 'none',
  },
})
