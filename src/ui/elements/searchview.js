let qs = require('query')
let template = require('template')
let render = require('../rendervdom')
let Emitter = require('emitter')

module.exports = SearchView

function SearchView() {
  Emitter.call(this)
  this.redraw.bind(this)
  this.init()
  this.search = {}
}

SearchView.prototype = Object.create(Emitter.prototype)

SearchView.prototype.init = function SearchView_init() {
  this.results = []
  this.hidden = true
  document.addEventListener('keyup', function(ev) {
    if (!this.hidden && ev.keyCode === 27) this.hideResults()
  }.bind(this))
  document.addEventListener('click', function (ev) {
    if (!this.hidden) {
      let parent = ev.target
      do {
        if (parent === this.el ||
          (parent.className === 'search' &&
           parent.tagName === 'INPUT')) return
      } while ((parent = parent.parentNode))
      this.hideResults()
    }
  }.bind(this))
}

SearchView.prototype.redraw = function SearchView_redraw() {
  render(this.search, template('searchresults.jade', {
    'results': this.results
  }))
}

SearchView.prototype.showResults = function SearchView_showResults(results) {
  this.results = results
  this.redraw()
  this.el = this.search.el
  qs('div.client-body').appendChild(this.el)
  let messageLinks = qs.all('a.message-link', this.el)
  for (let i = 0; i < messageLinks.length; i++)
    messageLinks[i].addEventListener('click', this.hideResults.bind(this))
  this.hidden = false
  this.emit('show')
}

SearchView.prototype.hideResults = function SearchView_removeResults() {
  let messageLinks = qs.all('a.message-link', this.el)
  for (let i = 0; i < messageLinks.length; i++)
    messageLinks[i].removeEventListener('click', this.hideResults.bind(this))
  if (!this.hidden) {
    this.results = []
    this.el.parentNode.removeChild(this.el)
    this.hidden = true
    this.emit('hide')
  }
}

