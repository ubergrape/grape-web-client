import {$, render} from '../../test'
import expect from 'expect.js'
import React from 'react'
import times from 'lodash/utility/times'
import {Simulate} from 'react-addons-test-utils'
import {IntlProvider} from 'react-intl'
import GrapeBrowser from '../GrapeBrowser'
import data0 from './mocks/data0.json'
import data1 from './mocks/data1.json'

describe('app:', () => {
  describe('GrapeBrowser()', () => {
    it('should render without props', () => {
      render(<GrapeBrowser />)
      expect($('grape-browser')).to.be.an(Element)
    })
  })

  describe('GrapeBrowser() with search', () => {
    it('should open search browser', () => {
      const input = (
        <IntlProvider locale="en" messages={{}}>
          <GrapeBrowser browser="search" data={data0} focused setTrigger />
        </IntlProvider>
      )
      render(input)
      expect($('search-browser', document.body)).to.be.an(Element)
    })
  })

  describe('GrapeBrowser() auto close', () => {
    function create(onDidMount, onRender) {
        // Results removed.
      const data = {...data0, results: []}
      const input = (
        <IntlProvider locale="en" messages={{}}>
          <GrapeBrowser
            browser="search"
            data={data}
            onDidMount={onDidMount}
            focused />
        </IntlProvider>
      )
      render(input, onRender)
    }

    it('shound render "nothing found"', done => {
      create(undefined, () => {
        const node = $('search-browser editable', document.body)
        node.value = 'asdef'
        Simulate.change(node)
        expect($('search-browser empty', document.body)).to.be.an(Element)
        done()
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

  describe('GrapeBrowser() should open users autocomplete', () => {
    it('should open users autocomplete', () => {
      const input = (
        <IntlProvider locale="en" messages={{}}>
          <GrapeBrowser browser="user" data={data1} focused />
        </IntlProvider>
      )
      render(input)
      expect($('grape-browser datalist', document.body)).to.be.an(Element)
    })
  })

  describe('GrapeBrowser() should close users autocomplete if there is space at the end and no results', () => {
    it('should open users autocomplete', () => {
      const input = (
        <IntlProvider locale="en" messages={{}}>
          <GrapeBrowser browser="user" data={data1} focused />
        </IntlProvider>
      )
      render(input)
      const node = $('grape-browser editable', document.body)
      node.value = '@ '
      Simulate.change(node)
      expect($('grape-browser datalist', document.body)).to.be(null)
    })
  })


  describe('GrapeBrowser() insert object:', () => {
    function insert(props) {
      const data = {...data0}
      data.search.queries = []
      const input = (
        <IntlProvider locale="en" messages={{}}>
          <GrapeBrowser
            browser="search"
            data={data}
            focused
            {...props} />
        </IntlProvider>
      )
      render(input)

      const node = $('search-browser editable', document.body)
      node.value = 'a'
      Simulate.change(node)
      times(2, () => {
        Simulate.keyDown(node, {keyCode: 13})
      })
    }

    it('should call onInsertItem with correct argument', (done) => {
      insert({
        onInsertItem: param => {
          expect(param.type).to.be('file')
          expect(param.service).to.be('googledrive')
          expect(param.rank).to.be(1)
          done()
        }
      })
    })

    it('should insert search object into editable', (done) => {
      let input
      let changeCounter = 0

      insert({
        onDidMount: _input => {
          input = _input
        },
        onChange: () => {
          const content = input.getTextContent()

          if (changeCounter === 1) {
            expect(content).to.be(' #')
          }

          if (changeCounter === 2) {
            const expectedContent = ' ["Plans/Discussions"](cg://googledrive|file|8b37ec07b198be90e8086e1065821492|https://docs.google.com/a/ubergrape.com/folderview?id=0B_TCKOxiyU4wNTBkNWZiNzAtZTVjZS00ZGUzLWI2ZjItZTNmMThmZjhjMDZj&usp=drivesdk||) '
            expect(content).to.be(expectedContent)
            done()
          }

          changeCounter++
        }
      })
    })
  })
})
