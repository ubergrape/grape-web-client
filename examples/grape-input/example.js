var searchResults = window.searchData.results

var input = document.querySelectorAll('grape-input')[0]

function getRank() {
  return Math.floor(Math.random() * 6) + 1
}

function setProps(newProps) {
  var props = getDefaultProps()
  for (var key in newProps) props[key] = newProps[key]
  input.props = props
}

function getDefaultProps() {
  return {
    customEmojis: {test: '../images/avatar.gif'},
    placeholder: 'Some placeholder',
    images: {
      emojiSheet: '../../node_modules/js-emoji/images/sheet_32.png',
      traubyReading: '../images/trauby-reading.png',
      traubyJuggling: '../images/trauby-juggling.png',
      noDetail: '../images/no-detail.png',
      orgLogo: '../images/avatar.gif',
      spinner: '../images/loading.gif'
    }
  }
}

function init() {
  setProps({focused: true})

  input.addEventListener('grapeComplete', function (e) {
    console.log('complete', e.detail)

    if (e.detail.trigger == '#') {
        var data = window.searchData
        data.results = searchResults.filter(match)
        setProps({
          browser: 'search',
          data: data
        })
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
      var key = e.detail.key
      var data = emoji.filter(key).map(function(emoji) {
        return Object.assign(emoji, { rank: getRank() })
      })

      setProps({
        browser: 'emojiSuggest',
        maxCompleteItems: 6,
        data: data
      })
    }

    function match(result) {
      return result.name.toLowerCase().indexOf(e.detail.search) >= 0
    }
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
    console.log('focus')
  })

  input.addEventListener('grapeBlur', function (e) {
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

  input.addEventListener('grapeSelectFilter', function (e) {
    console.log('select filter', e.detail)
    setProps({
      browser: 'search',
      data: window.searchData
    })
  })

}

function showSearchDelayed(delay) {
  setProps({browser: 'search', isLoading: true})
  setTimeout(function() {
    setProps({
      browser: 'search',
      data: window.searchData
    })
  }, delay)
}

document.addEventListener('DOMContentLoaded', init)
