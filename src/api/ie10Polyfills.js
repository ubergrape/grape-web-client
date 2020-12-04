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
        'intl/locale-data/jsonp/fr.js',
        'intl/locale-data/jsonp/it.js',
        'intl/locale-data/jsonp/es.js',
        'intl/locale-data/jsonp/ro.js',
        'intl/locale-data/jsonp/ru.js',
        'intl/locale-data/jsonp/tr.js',
        'intl/locale-data/jsonp/uk.js',
      ],
      require => {
        require('intl')
        require('intl/locale-data/jsonp/en.js')
        require('intl/locale-data/jsonp/de.js')
        require('intl/locale-data/jsonp/pl.js')
        require('intl/locale-data/jsonp/fr.js')
        require('intl/locale-data/jsonp/it.js')
        require('intl/locale-data/jsonp/es.js')
        require('intl/locale-data/jsonp/ro.js')
        require('intl/locale-data/jsonp/ru.js')
        require('intl/locale-data/jsonp/tr.js')
        require('intl/locale-data/jsonp/uk.js')
        resolve()
      },
    )
  })
