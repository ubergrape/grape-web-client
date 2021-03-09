export default {
  wrapper: {
    flex: 1,
  },
  header: {
    marginTop: 16,
  },
  button: {
    marginTop: 16,
  },
  description: {
    marginTop: 8,
  },
  empty: {
    marginTop: 24,
  },
  member: {
    marginTop: 24,
  },
  search: {
    marginTop: ({ isMemberOfEachGroup }) => (isMemberOfEachGroup ? 16 : 24),
  },
}
