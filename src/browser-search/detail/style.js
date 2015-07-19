import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

export default {
  detail: {
    flex: 1
  },
  header: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: colors.silverLight,
    borderBottom: '1px solid ' + colors.silverDark
  },
  icon: {
    height: 64,
    width: 64
  },
  body: {
    padding: 15
  },
  title: {
    ...fonts.big,
    margin: 0
  },
  subtitle: {
    ...fonts.normal,
    margin: '5px 0',
    color: colors.gainsboroDark
  },
  description: {
    margin: '0 0 10px 0'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.silverLight
  },
  emptyNote: {
    marginTop: 16,
    width: '50%',
    color: colors.gainsboroDark,
    textAlign: 'center'
  },
  metaContainer: {
    borderTop: '1px solid ' + colors.silverDark
  },
  metaRow: {
    display: 'flex',
    padding: '4px 0',
    borderBottom: '1px solid ' + colors.silverDark
  },
  metaLabel: {
    flex: '1 0 0%',
    color: colors.gainsboroDark
  },
  metaValue: {
    flex: '2 0 0%'
  }
}
