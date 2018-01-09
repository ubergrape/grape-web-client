/* eslint-disable camelcase, no-undef */
if (__IS_DEV_SERVER__) {
  __webpack_public_path__ = `${window.location.origin}/static/app/`
} else {
  __webpack_public_path__ = `${window.location.origin}/grape-web-client@${__VERSION__}/dist/app/`
}
/* eslint-enable */
