var context = require.context('./src', true, /tests/)
context.keys().forEach(context)
