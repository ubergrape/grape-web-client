import alertStyles from '../alert/style'
export default {
  ...alertStyles,
  layout: {
    display: 'flex',
    alignItems: 'baseline'
  },
  mainCol: {
    flexGrow: 1,
    fontWeight: 'bold'
  },
  secondaryCol: {
    margin: '0 10px'
  }
}
