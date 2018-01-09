/* eslint-disable camelcase, no-undef */
if (__IS_DEV_SERVER__) {
  __webpack_public_path__ = `${window.location.origin}/static/app/`
} else {
  __webpack_public_path__ = `${window.location.origin}/dist/app/`
}
/* eslint-enable */
