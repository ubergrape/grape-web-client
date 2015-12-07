import {$, render} from '../../test'
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
      function onDidMount(component) {
        component.setTextContent('[name](cg://chatgrape|room|1|/chat/slug)')
        setTimeout(() => {
          expect(component.state.objects['@name']).to.be.a(Room)
          done()
        }, 0)
      }
      const textarea = (
        <HighlightedTextarea
          onDidMount={onDidMount}
          focused />
      )
      render(textarea)
    })
  })
})
