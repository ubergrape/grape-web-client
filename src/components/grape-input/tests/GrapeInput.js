import {$, render} from '../../test'
import expect from 'expect.js'
import React from 'react'
import GrapeInput from '../GrapeInput'
import Room from '../../objects/classes/Room'

describe('grape-input:', () => {
  describe('GrapeInput()', () => {
    it('should render without props', () => {
      render(<GrapeInput />)
      expect($('highlighted-editable')).to.be.an(Element)
    })
  })

  describe('GrapeInput#setTextContent', () => {
    it('should parse markdown', done => {
      let resizeFlag = false

      function onDidMount(component) {
        component.setTextContent('[name](cg://chatgrape|room|1|/chat/slug)')
        setTimeout(() => {
          expect(component.state.objectsMap['@name']).to.be.a(Room)
          expect(resizeFlag).to.be(true)
          done()
        }, 0)
      }

      function onResize() {
        resizeFlag = true
      }

      const textarea = (
        <GrapeInput
          onDidMount={onDidMount}
          onResize={onResize}
          focused />
      )
      render(textarea)
    })
  })
})
