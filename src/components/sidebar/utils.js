import conf from '../../conf'

export const getRoles = ({ channel, user }) => {
  const isAdmin = user.role === conf.constants.roles.ROLE_ADMIN
  const isGuest = user.role === conf.constants.roles.ROLE_GUEST
  const isInvited = user.role === conf.constants.roles.ROLE_INVITED
  const isCreator = channel.creator && user.id === channel.creator
  return {
    isAdmin,
    isGuest,
    isInvited,
    isCreator,
    allowEdit: isAdmin || isCreator,
  }
}
