import {data as icons} from 'grape-web/lib/svg-icons'
import fonts from 'grape-theme/dist/fonts'
import utils from 'grape-jss-utils'

const action = {
  ...utils.ellipsis,
  ...fonts.big,
  position: 'relative',
  paddingLeft: 17,
  marginBottom: 10,
  background: 'no-repeat left center'
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
    backgroundImage: `url('${icons.link}')`
  },
  skype: {
    ...action,
    backgroundImage: `url('${icons.skype}')`
  },
  phone: {
    ...action,
    backgroundImage: `url('${icons.phone}')`
  }
}
