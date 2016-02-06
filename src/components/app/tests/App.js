import {$, render} from '../../test'
import expect from 'expect.js'
import React from 'react'
import times from 'lodash/utility/times'
import {Simulate} from 'react-addons-test-utils'
import App from '../App'
import data0 from './mocks/data0.json'

describe('app:', () => {
  describe('App()', () => {
    it('should render without props', () => {
      render(<App />)
      expect($('grape-browser')).to.be.an(Element)
    })
  })

  describe('App() with search', () => {
    it('should open search browser', () => {
      const input = <App browser="search" data={data0} focused setTrigger />
      render(input)
      expect($('search-browser', document.body)).to.be.an(Element)
    })
  })

  describe('App() auto close', () => {
    function create(onDidMount, onRender) {
        // Results removed.
      const data = {...data0, results: []}
      const input = (
        <App
          browser="search"
          data={data}
          onDidMount={onDidMount}
          focused />
      )
      render(input, onRender)
    }

    it('shound render "nothing found"', done => {
      create(undefined, () => {
        expect($('search-browser empty', document.body)).to.be.an(Element)
        done()
      })
    })

    it('should close browser if there is space at the end and no results', (done) => {
      create(component => {
        component.query.set('search', 'something ', {silent: true})
        create(undefined, () => {
          const browser = $('search-browser', document.body)
          expect(browser).to.be(null)
          done()
        })
      })
    })

    it('should stay opened when space is not at the end', (done) => {
      create(component => {
        component.query.set('search', 'something else', {silent: true})
        create(undefined, () => {
          const browser = $('search-browser', document.body)
          expect(browser).to.be.an(Element)
          done()
        })
      })
    })
  })

  describe('App() insert object', () => {
    function insert(onInsertItem, onDidMount) {
      const data = {...data0}
      data.search.queries = []
      const input = (
        <App
          browser="search"
          data={data}
          onInsertItem={onInsertItem}
          onDidMount={onDidMount}
          focused/>
      )
      render(input)

      times(2, () => {
        Simulate.keyDown($('search-browser input', document.body), {keyCode: 13})
      })
    }

    it('should call onInsertItem with correct argument', (done) => {
      insert(param => {
        expect(param.type).to.be('file')
        expect(param.service).to.be('googledrive')
        expect(param.rank).to.be(1)
        done()
      })
    })

    it('should call replaceQuery with correct replacement', (done) => {
      insert(undefined, input => {
        input.replace = object => {
          // Verify there are no missing params in objects.
          expect(object.name).to.be('"Plans/Discussions"')
          expect(object.content).to.be('#"Plans/Discussions"')
          done()
        }
      })
    })
  })
})
