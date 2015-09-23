var context = require.context('./src', true, /tests/);
window.CHATGRAPE_CONFIG = {
    'staticPath': 'http://example/'
};
context.keys().forEach(context);
