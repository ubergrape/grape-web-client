import rpc from '../rpc'
import { sequenceToSettings, settingsToSequence } from '../notification'

export const setNotificationSetting = (orgId, channelId, settings) =>
  rpc({
    ns: 'notifications',
    action: 'update_settings',
    args: [`${orgId}:${channelId}`, settingsToSequence(settings)],
  })

export const getNotificationSettings = (orgId, channelId) =>
  rpc(
    {
      ns: 'notifications',
      action: 'get_settings',
      args: [`${orgId}:${channelId}`],
    },
    { camelize: true },
  ).then(sequenceToSettings)

export const setNotificationSession = ({ orgId, clientId }) =>
  rpc({
    ns: 'notifications',
    action: 'set_notification_session',
    clientId,
    args: [orgId],
  })
