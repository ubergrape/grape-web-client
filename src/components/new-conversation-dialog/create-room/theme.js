export default {
  wrapper: {
    flex: 1,
  },
  backWrapper: {
    flex: '0 0 auto',
    display: 'flex',
  },
  back: {
    marginRight: 8,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  form: {
    width: ({ overflowPadding }) => `calc(100% - ${overflowPadding}px)`,
  },
  switch: {
    flex: '0 0 auto',
    marginTop: 24,
  },
  name: {
    flex: '0 0 auto',
    maxWidth: 410,
    marginTop: 24,
  },
  description: {
    flex: '0 0 auto',
    marginTop: 24,
  },
  members: {
    flex: '0 0 auto',
    marginTop: 24,
  },
  listWrapper: {
    position: 'relative',
    flex: 1,
    minHeight: 102, // 96 + 6. 32 is one block, 32 * 3 = 96. 6 this is sum of margins from list below
    marginTop: 8,
  },
  selectedMembers: {
    flex: '0 0 auto',
    marginTop: 8,
    display: 'flex',
  },
  list: {
    // https://stackoverflow.com/a/8468131
    position: 'absolute',
    height: 'calc(100% - 6px)',
    '& .ReactVirtualized__Grid__innerScrollContainer': {
      overflow: [['visible'], '!important'],
      margin: [2.5, 0],
      display: 'flex',
    },
    '& .ReactVirtualized__List:focus': {
      outline: 0,
    },
  },
  item: {
    width: '100%',
  },
  buttons: {
    flex: '0 0 auto',
    marginTop: 24,
  },
  loading: {
    marginLeft: 4,
  },
  memberNotFound: {
    marginLeft: 4,
    display: 'flex',
  },
}
