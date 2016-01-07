import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

const columnMarginRight = 10
const leftColumnWidth = 60

export default {
  detail: {
    flex: 1
  },
  previewContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: colors.silverLight,
    height: 128
  },
  article: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    borderBottom: '1px solid ' + colors.silverDark,
    padding: 20,
    paddingBottom: 10
  },
  icon: {
    height: leftColumnWidth,
    width: leftColumnWidth,
    flexShrink: 0,
    marginRight: columnMarginRight
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
    ...fonts.small,
    margin: '0 0 10px 0'
  },
  metaContainer: {
    padding: 20,
    paddingTop: 10
  },
  metaRow: {
    display: 'flex',
    padding: '2px 0'
  },
  metaLabel: {
    ...fonts.small,
    color: colors.gainsboroDark,
    textAlign: 'right',
    marginRight: columnMarginRight,
    width: leftColumnWidth
  },
  metaValue: {
    ...fonts.small,
    flex: '2 0 0%'
  }
}
