import conf from '../conf'

const staticPath = conf.server.staticPath
// eslint-disable-next-line camelcase, no-undef
__webpack_public_path__ = staticPath.substring(0, staticPath.lastIndexOf('/'))
