import Model from 'model'
import cache from 'model-cache'

import staticUrl from '../../../utils/static-url'

export default new Model([
  'username',
  'firstName',
  'lastName',
  'displayName',
  'status',
  'avatar',
  'email',
  'skype_username',
  'phone_number',
  'what_i_do',
  'is_only_invited',
  'role',
  'title',
  'pm',
  'slug'
])
  .use(cache('id'))
  .use(defaultAvatar('images/avatar.gif', 'images/avatar_invited.gif'))
  .use(setSlug())

function defaultAvatar(url, urlInvited) {
  return (Model) => {
    Model.on('construct', (instance, initial) => {
      if (initial.is_only_invited) {
        initial.avatar = staticUrl(urlInvited)
      }
      initial.avatar = initial.avatar || staticUrl(url)
    })
  }
}

function setSlug() {
  return (Model) => {
    Model.on('construct', (instance, initial) => {
      initial.slug = createSlug(initial.username)
    })

    Model.on('change username', (instance, username) => {
      instance.slug = createSlug(username)
    })
  }
}

function createSlug(username) {
  return `@${username}`
}

