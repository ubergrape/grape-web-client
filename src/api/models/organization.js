import Model from 'model'
import cache from 'model-cache'
import array from 'model-array'
import staticurl from 'staticurl'

export default new Model([
    'logo',
    'role',
    'title', // custom title for the current user in this org
    'custom_emojis',
    'has_integrations',
    'inviter_role',
    'features'
  ])
  .use(cache('id'))
  .use(array)
  .array('rooms')
  .array('pms')
  .array('users')
  .use(defaultLogo('images/cg-company.png'))

function defaultLogo(url) {
  return function (Model) {
    Model.on('construct', function (instance, initial) {
      initial.logo = initial.logo || staticurl(url)
    })
  }
}

