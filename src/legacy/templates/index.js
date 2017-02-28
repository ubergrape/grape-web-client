import template from 'template'
import v from 'virtualdom'
import domify from 'domify'

template.locals._ = require('t')
template.locals.constants = require('../../conf').constants
template.locals.html = html => v.fromDOM(domify(html))

template.templates = {
  'grapeInput.jade': require('./grapeInput.jade')
}
