import {$} from '../../test'
import expect from 'expect.js'
import React from 'react/addons'
import Input from '../Input'
import data0 from './mocks/data0.json'

let {render} = React
let {TestUtils} = React.addons
let {Simulate} = TestUtils

describe('input:', () => {
  describe('Input()', () => {
    it('should render without props', () => {
      render(<Input />, document.body)
      expect($('grape-input')).to.be.an(Element)
    })
  })

  describe('Input() with search', () => {
    it('should open search browser', () => {
      let input = <Input browser="search" data={data0} focused={true} />
      render(input, document.body)
      let completeWrapper = $('grape-input complete-wrapper')
      expect(completeWrapper).to.be.an(Element)
      expect(completeWrapper.children.length).to.be(1)
    })
  })

  describe('Input() auto close', () => {
    function create(onDidMount, onRender) {
        // Results removed.
      let data = {...data0, results: []}
      let input = (
        <Input
          browser="search"
          data={data}
          focused={true}
          onDidMount={onDidMount} />
      )
      render(input, document.body, onRender)
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
          let completeWrapper = $('grape-input complete-wrapper')
          expect(completeWrapper.children.length).to.be(0)
          done()
        })
      })
    })

    it('should stay opened when space is not at the end', (done) => {
      create(component => {
        component.query.set('search', 'something else', {silent: true})
        create(null, () => {
          let completeWrapper = $('grape-input complete-wrapper')
          expect(completeWrapper.children.length).to.be(1)
          done()
        })
      })
    })

    it('should stay closed when user continued typing after space', (done) => {
      create(component => {
        let completeWrapper = $('grape-input complete-wrapper')
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

  describe('Input() insert object', () => {
    function insert(onInsertItem, onDidMount) {
      let data = {...data0}
      data.search.queries = []
      let input = (
        <Input
          browser="search"
          data={data}
          focused={true}
          onInsertItem={onInsertItem}
          onDidMount={onDidMount} />
      )
      render(input, document.body)
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
          expect(replacement.indexOf('undefined')).to.be(-1)
          done()
        }
      })
    })
  })
})
