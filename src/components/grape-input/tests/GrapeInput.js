import {$, render} from '../../test'
import expect from 'expect.js'
import React from 'react'
import GrapeInput from '../GrapeInput'

describe('grape-input:', () => {
  describe('GrapeInput()', () => {
    it('should render without props', () => {
      render(<GrapeInput />)
      expect($('highlighted-editable')).to.be.an(Element)
    })
  })

  describe('GrapeInput set content', () => {
    it('should parse markdown content', done => {
      let resized = false

      function onDidMount(component) {
        expect(resized).to.be(true)
        expect(component.state.value).to.be('@room')
        done()
      }

      function onResize() {
        resized = true
      }

      const grapeInput = (
        <GrapeInput
          onResize={onResize}
          onDidMount={onDidMount}
          content={'[room](cg://chatgrape|room|1|/chat/slug)'}
          focused />
      )
      render(grapeInput)
    })
  })
})
