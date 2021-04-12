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
      margin: [2.5, 0],
      display: 'flex',
    },
    '& .ReactVirtualized__List:focus': {
      outline: 0,
    },
  },
  cluster: {
    marginLeft: 4,
    marginBottom: 12,
  },
  loading: {
    marginLeft: 4,
  },
  notFound: {
    marginLeft: 4,
  },
}
