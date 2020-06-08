export default options =>
  new Promise(resolve => {
    if (window.Intl && window.location.origin) {
      resolve()
      return
    }

    // eslint-disable-next-line camelcase, no-undef
    __webpack_public_path__ = `${options.staticBaseUrl}app/`

    require.ensure(
      [
        'intl',
        'intl/locale-data/jsonp/en.js',
        'intl/locale-data/jsonp/de.js',
        'intl/locale-data/jsonp/pl.js',
      ],
      require => {
        require('intl')
        require('intl/locale-data/jsonp/en.js')
        require('intl/locale-data/jsonp/de.js')
        require('intl/locale-data/jsonp/pl.js')
        resolve()
      },
    )
  })
