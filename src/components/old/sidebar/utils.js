import conf from '../../../conf'

export const getRoles = ({ channel, user }) => {
  const isAdmin = user.role >= conf.constants.roles.ROLE_ADMIN
  const isCreator = channel.creator && user.id === channel.creator
  return {
    isAdmin,
    isCreator,
    allowEdit: isAdmin || isCreator,
  }
}
