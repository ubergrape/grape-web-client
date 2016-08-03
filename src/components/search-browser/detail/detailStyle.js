import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import mixins from 'grape-web/lib/jss-utils/mixins'

const columnMarginRight = 10
const leftColumnWidth = 60

export default {
  detail: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // Workaround, can't get height to fill the sidebar.
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  content: {
    flex: 1,
    overflow: 'auto'
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
    borderBottom: `1px solid ${colors.silverDark}`,
    padding: 20,
    paddingBottom: 10
  },
  icon: {
    height: leftColumnWidth,
    width: leftColumnWidth,
    flexShrink: 0,
    marginRight: columnMarginRight,
    backgroundSize: '100%'
  },
  articleBody: {
    flex: 1
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
    ...mixins.ellipsis,
    flex: '2 0 0%'
  }
}
