var conf = module.exports = window.CHATGRAPE_CONFIG

if (!conf.forceLongpolling && localStorage.forceLongpolling) {
  conf.forceLongpolling = true
}
