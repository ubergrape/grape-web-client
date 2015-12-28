import {$, render} from '../../test'
import expect from 'expect.js'
import React from 'react'
import {Simulate} from 'react-addons-test-utils'
import GrapeInput from '../GrapeInput'
import data0 from './mocks/data0.json'

describe('grape-input:', () => {
  describe('GrapeInput()', () => {
    it('should render without props', () => {
      render(<GrapeInput />)
      expect($('grape-input')).to.be.an(Element)
    })
  })

  describe('GrapeInput() with search', () => {
    it('should open search browser', () => {
      const input = <GrapeInput browser="search" data={data0} focused />
      render(input)
      expect($('search-browser', document.body)).to.be.an(Element)
    })
  })

  describe('GrapeInput() auto close', () => {
    function create(onDidMount, onRender) {
        // Results removed.
      const data = {...data0, results: []}
      const input = (
        <GrapeInput
          browser="search"
          data={data}
          onDidMount={onDidMount}
          focused/>
      )
      render(input, onRender)
    }

    it('shound render "nothing found"', done => {
      create(null, () => {
        expect($('search-browser empty', document.body)).to.be.an(Element)
        done()
      })
    })

    it('should close browser if there is space at the end and no results', (done) => {
      create(component => {
        component.query.set('search', 'something ', {silent: true})
        create(null, () => {
          const browser = $('search-browser', document.body)
          expect(browser).to.be(null)
          done()
        })
      })
    })

    it('should stay opened when space is not at the end', (done) => {
      create(component => {
        component.query.set('search', 'something else', {silent: true})
        create(null, () => {
          const browser = $('search-browser', document.body)
          expect(browser).to.be.an(Element)
          done()
        })
      })
    })
  })

  describe('GrapeInput() insert object', () => {
    function insert(onInsertItem, onDidMount) {
      const data = {...data0}
      data.search.queries = []
      const input = (
        <GrapeInput
          browser="search"
          data={data}
          onInsertItem={onInsertItem}
          onDidMount={onDidMount}
          focused/>
      )
      render(input)
      Simulate.keyDown($('search-browser input', document.body), {keyCode: 13})
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
      insert(null, input => {
        input.replaceQuery = replacement => {
          // Verify there are no missing params in objects.
          expect(replacement.name).to.be('"Plans/Discussions"')
          expect(replacement.content).to.be('#"Plans/Discussions"')
          done()
        }
      })
    })
  })
})
