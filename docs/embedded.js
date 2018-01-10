(function(options) {
  const script = document.createElement('script')
  script.async = true
  script.src = options.staticUrl
  script.onload = function() {
    grapeClient.embed(options)
    if (options.onReady) options.onReady()
  }
  document.body.appendChild(script)
})({
  container: '#grape-client',
  channelId: 632,
  orgId: 1,
  serviceUrl: 'https://uebergrape.staging.chatgrape.com',
  staticUrl: 'https://unpkg.com/grape-web-client/dist/app/embedded.js',
  onReady: function() {
    console.log('Grape Client initialized')
  }
})
