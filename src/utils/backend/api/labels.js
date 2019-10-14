import rpc from '../rpc'

export const loadLabeledMessages = (orgId, options = {}) =>
  rpc(
    {
      ns: 'labels',
      action: 'get_labeled_messages',
      args: [orgId, options],
    },
    { camelize: true },
  )

export const loadLabelsConfig = orgId =>
  rpc(
    {
      ns: 'labels',
      action: 'get_label_configuration',
      args: [orgId],
    },
    { camelize: true },
  ).then(res => res)
