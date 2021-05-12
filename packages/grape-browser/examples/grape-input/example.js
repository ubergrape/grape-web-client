var searchResults = window.searchData.results

var input = document.querySelectorAll('grape-input')[0]

function getRank() {
  return Math.floor(Math.random() * 6) + 1
}

function setProps(newProps) {
  var props = getDefaultProps()
  assign(props, newProps)
  input.props = props
}

function assign(a, b) {
  for (var key in b) a[key] = b[key]
  return a
}

function getDefaultProps() {
  return {
    focused: true,
    customEmojis: {test: '../images/avatar.gif'},
    placeholder: 'Some placeholder',
    images: {
      emojiSheet: '../../node_modules/grape-js-emoji/images/sheet_32.png',
      traubyReading: '../images/trauby-reading.png',
      traubyJuggling: '../images/trauby-juggling.png',
      noDetail: '../images/no-detail.png',
      orgLogo: '../images/avatar.gif',
      spinner: '../images/loading.gif'
    }
  }
}

function init() {
  setProps()

  input.addEventListener('grapeComplete', function (e) {
    console.log('complete', e.detail)

    if (e.detail.trigger == '#') {
      var data = assign({}, window.searchData)
      var filters = e.detail.filters || []
      var search = e.detail.search

      if (filters.length) {
        data.results = data.results.filter(function(result) {
          return e.detail.filters.indexOf(result.service) >= 0
        })
      }

      if (search) {
        data.results = data.results.filter(match)
      }

      if (!filters.length && !search) data = undefined

      setProps({browser: 'search', data: data})
    }
    else if (e.detail.trigger == '@') {
      var data = window.userData
      if (e.detail.search) data = data.filter(match)
      setProps({
        data: data,
        browser: 'user'
      })
    }
    else if (e.detail.trigger == ':') {
      var emoji = e.detail.emoji
      var search = e.detail.search
      var data = emoji.filter(search).map(function(emoji) {
        return Object.assign(emoji, { rank: getRank() })
      })

      setProps({
        browser: 'emojiSuggest',
        maxSuggestions: 6,
        data: data
      })
    }

    function match(result) {
      return result.name.toLowerCase().indexOf(e.detail.search) >= 0
    }
  })

  input.addEventListener('grapeLoadServices', function() {
    console.log('loadServices')
    setProps({
      browser: 'search',
      services: window.searchData.services
    })
  })

  input.addEventListener('grapeSubmit', function (e) {
    console.log('submit', e.detail)
    input.setTextContent('')
  })

  input.addEventListener('grapeEditPrevious', function (e) {
    console.log('edit previous')
  })

  input.addEventListener('grapeChange', function (e) {
    console.log('change', input.getTextContent())
  })

  input.addEventListener('grapeFocus', function (e) {
    setProps({focused: true})
    console.log('focus')
  })

  input.addEventListener('grapeBlur', function (e) {
    setProps({focused: false})
    console.log('blur')
  })

  input.addEventListener('grapeAbort', function (e) {
    console.log('abort')
  })

  input.addEventListener('grapeResize', function (e) {
    console.log('resize')
  })

  input.addEventListener('grapeInsertItem', function (e) {
    console.log('grapeInsertItem', e.detail)
  })

  input.addEventListener('grapeAddIntegration', function (e) {
    console.log('add integration')
  })
}

function showSearchDelayed(delay) {
  setProps({browser: 'search', isLoading: true, setTrigger: true})
  setTimeout(function() {
    setProps({
      browser: 'search',
      data: window.searchData
    })
  }, delay)
}

document.addEventListener('DOMContentLoaded', init)
