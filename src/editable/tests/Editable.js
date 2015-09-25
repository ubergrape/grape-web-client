import {$} from '../../test'
import expect from 'expect.js'
import React from 'react/addons'
import Editable from '../Editable'
import Caret from '../Caret'

let {render} = React

describe('editable', () => {
  describe('Editable()', () => {
    it('should render without props', () => {
      render(<Editable />, document.body)
      expect($('editable')).to.be.an(Element)
    })
  })

  describe('Editable#modify', () => {
    it('should ensure text whitespaces', done => {
      let editable = (
        <Editable
          onDidMount={onDidMount}
          focused={true} />
      )
      render(editable, document.body)
      function onDidMount(component) {
        component.caret.getParent = () => {
          let div = document.createElement('div')
          div.innerHTML = `a${Caret.MARKER_HTML}b&nbsp;`
          return div
        }
        component.modifyAtCaret((left, right) => {
          expect(left).to.be('a')
          expect(right).to.be('b ')
          return []
        })
        done()
      }
    })
  })

  describe('Editable#setTextContent', () => {
    it('should call onResize', done => {
      let editable = (
        <Editable
          onDidMount={onDidMount}
          onResize={onResize}
          focused={true} />
      )
      render(editable, document.body)
      function onDidMount(component) {
        component.setTextContent('something\nmultiline')
      }
      function onResize() {
        expect(true).to.be.ok()
        done()
      }
    })
  })
})
