let Model = require('model')
let cache = require('model-cache')
let cast = require('model-cast')
let array = require('model-array')

let User = require('./user')
let Channel = require('./room')

module.exports = new Model([
    'author',
    'channel',
    'time',
    'user_time',
    'read' // to track if the current user has read the line
  ])
  .use(cache('id'))
  .use(cast)
  .cast('author', castAuthor)
  .cast('channel', castChannel)
  .cast('time', cast.Date)
  .use(array)
  .array('readers')

function castAuthor(author) {
  if (author.type === 'user') {
    let user = User.get(author.id) || new User({id: author.id})
    if (user) {
      user['type'] = 'user'
    }
    return user
  }

  if (author.type === 'service'){
    return {
      'id': author.id,
      'username': author.username || author.id,
      'type': 'service'
    }
  }

  return author
}


// for display in search results we need the channel name as well
function castChannel(channel) {
  let ch = Channel.get(channel)
  if (ch)
    return ch
  return channel
}
