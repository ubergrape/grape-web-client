export default options =>
  new Promise(resolve => {
    if (window.Intl && global.location.origin) {
      resolve()
      return
    }

    // eslint-disable-next-line camelcase, no-undef
    __webpack_public_path__ = `${options.staticBaseUrl}app/`

    require.ensure(
      ['intl', 'intl/locale-data/jsonp/en.js', 'intl/locale-data/jsonp/de.js'],
      require => {
        require('intl')
        require('intl/locale-data/jsonp/en.js')
        require('intl/locale-data/jsonp/de.js')
        resolve()
      },
    )
  })
