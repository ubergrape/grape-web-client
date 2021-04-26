export default {
  wrapper: {
    flex: 1,
  },
  description: {
    flex: '0 0 auto',
    marginTop: 8,
  },
  search: {
    flex: '0 0 auto',
    marginTop: 16,
  },
  empty: {
    flex: '0 0 auto',
    marginTop: 24,
  },
  member: {
    flex: '0 0 auto',
    marginTop: 16,
  },
  link: {
    flex: '0 0 auto',
    marginTop: 16,
  },
  listWrapper: {
    flex: 1,
    minHeight: 126, // 120 + 6. 40 is one block, 40 * 3 = 120. 6 this is sum of margins from list below
    marginTop: 12,
  },
  list: {
    height: 'calc(100% - 6px)',
    '& .ReactVirtualized__Grid__innerScrollContainer': {
      overflow: [['visible'], '!important'],
      margin: [2, 0],
      display: 'flex',
    },
    '& .ReactVirtualized__List:focus': {
      outline: 0,
    },
  },
  separator: {
    paddingLeft: 4,
    paddingBottom: 12,
  },
  skeleton: {
    padding: 4,
    margin: [0, 2],
    display: 'flex',
  },
  skeletonAvatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: '#f1f1f1',
  },
  skeletonText: {
    marginLeft: 8,
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  skeletonTitle: {
    width: 100,
    height: 12,
    margin: [2, 0],
    backgroundColor: '#f1f1f1',
  },
  skeletonDescription: {
    width: 300,
    height: 12,
    margin: [2, 0],
    backgroundColor: '#f1f1f1',
  },
  time: {
    margin: [0, 8, 0, 'auto'],
  },
}
