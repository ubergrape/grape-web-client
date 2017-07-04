import conf from '../../../conf'

const {constants} = conf

export const getRoles = ({channel, user}) => {
  const isAdmin = user.role >= constants.roles.ROLE_ADMIN
  const isCreator = channel.creator && user.id === channel.creator
  return {
    isAdmin,
    isCreator,
    allowEdit: isAdmin || isCreator
  }
}
