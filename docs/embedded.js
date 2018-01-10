(function(options) {
  const script = document.createElement('script')
  script.async = true
  script.src = options.staticUrl
  script.onload = function() {
    grapeClient.embed(options)
    if (options.onReady) options.onReady()
  }
})({
  container: '#grape-client',
  channelId: 632,
  //channelId: 2253,
  orgId: 1,
  serviceUrl: 'https://uebergrape.staging.chatgrape.com',
  staticUrl: 'https://unpkg.com/grape-web-client/dist/app/embedded.js',
  onReady: function() {
    console.log('Grape Client initialized')
  }
})
