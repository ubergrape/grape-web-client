const src = document.querySelectorAll('[src*="embedded"], [src*="app"]')[0].getAttribute('src')
// eslint-disable-next-line camelcase, no-undef
__webpack_public_path__ = src.substring(0, src.lastIndexOf('/'))
