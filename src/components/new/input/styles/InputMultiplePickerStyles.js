import theme from '../../../../constants/theme'

export default {
  multipleInput: ({ focused }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    minHeight: '32px',
    borderRadius: '32px',
    padding: '2px 4px',
    border: `1px solid ${
      focused ? theme.colorIconActive : theme.colorBorderSeparator
    }`,
  }),
}
