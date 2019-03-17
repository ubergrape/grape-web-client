;(function(options) {
  const script = document.createElement('script')
  script.async = true
  script.src = `${options.staticBaseUrl}app/embedded.js`
  script.onload = function() {
    grapeClient.embed(options)
    if (options.onReady) options.onReady()
  }
  document.head.appendChild(script)
})({
  container: '#grape-client',
  channelId: 632,
  // channelId: 2253,
  orgId: 1,
  serviceUrl: 'https://uebergrape.staging.chatgrape.com',
  staticBaseUrl: 'https://unpkg.com/grape-web-client/dist/',
  onReady() {
    console.log('Grape Client initialized')
  },
})
