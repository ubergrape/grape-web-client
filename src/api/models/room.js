let Model = require('model')
let cache = require('model-cache')
let cast = require('model-cast')
let array = require('model-array')

let User = require('./user')

module.exports = new Model([
    'name',
    'slug',
    'description',
    'creator',
    'joined',
    'unread',
    'mentioned',
    'typing',
    'is_public',
    'first_message_time',
    'latest_message_time'
  ])
  .use(cache('id'))
  .use(array)
  .array('history', {events: false})
  .array('searchHistory', {events: false})
  .array('typing', {events: false})
  .array('users', {childEvents: true}) // TODO: maybe make this a map?
  .use(cast)
  .cast('creator', castCreator)
  .use(children)

// some internal lookup maps
function children(Model) {
  Model.on('construct', function (instance) {
    // a map of typing user ids
    instance.typing = Object.create(null)
    // this is a map from user ids to lines read by the user
    instance._readingStatus = Object.create(null)
  })
}


function castCreator(creator_id) {
  if (creator_id !== null) {
    let user = User.get(creator_id)
    if (user) return user
  }

  return null
}

