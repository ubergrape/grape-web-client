import {$, render} from '../../test'
import noop from 'lodash/utility/noop'
import expect from 'expect.js'
import React from 'react'
import HighlightedTextarea from '../HighlightedTextarea'
import Room from '../../objects/classes/Room'

describe('highlighted', () => {
  describe('HighlightedTextarea()', () => {
    it('should render without props', () => {
      render(<HighlightedTextarea />)
      expect($('highlighted-textarea')).to.be.an(Element)
    })
  })

  describe('HighlightedTextarea#setTextContent', () => {
    it('should parse markdown', done => {
      let resizeFlag = false

      function onDidMount(component) {
        component.setTextContent('[name](cg://chatgrape|room|1|/chat/slug)')
        setTimeout(() => {
          expect(component.state.objects['@name']).to.be.a(Room)
          expect(resizeFlag).to.be(true)
          done()
        }, 0)
      }

      function onResize() {
        resizeFlag = true
      }

      const textarea = (
        <HighlightedTextarea
          onDidMount={onDidMount}
          onChange={noop}
          onBlur={noop}
          onResize={onResize}
          focused />
      )
      render(textarea)
    })
  })
})
