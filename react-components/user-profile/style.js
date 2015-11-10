import {data as icons} from 'grape-web/lib/svg-icons'
import fonts from 'grape-theme/dist/fonts'
import utils from 'grape-jss-utils'

const action = {
  ...utils.ellipsis,
  ...fonts.big,
  position: 'relative',
  paddingLeft: 17,
  marginBottom: 10
}

const icon = {
  content: '""',
  position: 'absolute',
  left: 0,
  width: 15,
  height: '100%',
  background: 'no-repeat center'
}

export default {
  profile: {
    display: 'flex'
  },
  leftColumn: {
    flexShrink: 0,
    width: 60,
    paddingRight: 20,
  },
  rightColumn: {
    flex: 1
  },
  avatar: {
    borderRadius: '50%',
    width: '100%'
  },
  fullName: {
    ...fonts.big,
    ...utils.ellipsis
  },
  username: {
    ...utils.ellipsis,
    marginBottom: 20
  },
  about: {
    marginBottom: 20,
    maxHeight: 200,
    overflowY: 'auto'
  },
  email: {
    ...action,
    '&:before': {
      ...icon,
      backgroundImage: `url('${icons.link}')`
    }
  },
  skype: {
    ...action,
    '&:before': {
      ...icon,
      backgroundImage: `url('${icons.skype}')`
    }
  },
  phone: {
    ...action,
    '&:before': {
      ...icon,
      backgroundImage: `url('${icons.phone}')`
    }
  }
}
