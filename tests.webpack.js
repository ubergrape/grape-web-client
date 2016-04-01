let context = require.context('./src', true, /tests/)

window.CHATGRAPE_CONFIG = {
  staticPath: 'http://example/',
  constants: {
    roles: {
      ROLE_USER: 0,
      ROLE_ADMIN: 1,
      ROLE_OWNER: 2
    }
  }
}
context.keys().forEach(context)
