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
      const completeWrapper = $('grape-input complete-wrapper')
      expect(completeWrapper).to.be.an(Element)
      expect(completeWrapper.children.length).to.be(1)
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
        expect($('grape-input empty')).to.be.an(Element)
        done()
      })
    })

    it('should close browser if there is space at the end and no results', (done) => {
      create(component => {
        component.query.set('search', 'something ', {silent: true})
        create(null, () => {
          const completeWrapper = $('grape-input complete-wrapper')
          expect(completeWrapper.children.length).to.be(0)
          done()
        })
      })
    })

    it('should stay opened when space is not at the end', (done) => {
      create(component => {
        component.query.set('search', 'something else', {silent: true})
        create(null, () => {
          const completeWrapper = $('grape-input complete-wrapper')
          expect(completeWrapper.children.length).to.be(1)
          done()
        })
      })
    })

    it('should stay closed when user continued typing after space', (done) => {
      create(component => {
        const completeWrapper = $('grape-input complete-wrapper')
        component.query.set('search', 'something else', {silent: true})
        create(null, () => {
          component.query.set('search', 'something else ', {silent: true})
          create(null, () => {
            expect(completeWrapper.children.length).to.be(0)
            done()
          })
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
      Simulate.keyDown($('grape-input browser input'), {keyCode: 13})
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
