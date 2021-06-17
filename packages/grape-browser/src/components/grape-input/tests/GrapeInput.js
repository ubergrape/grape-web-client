import expect from 'expect.js'
import { IntlProvider } from 'react-intl'
import React from 'react'

import { $, render } from '../../../test'
import GrapeInput from '../GrapeInput'

describe('grape-input:', () => {
  describe('GrapeInput()', () => {
    it('should render without props', () => {
      console.error = msg => {
        throw new Error(msg)
      }
      render(
        <IntlProvider locale="en" messages={{}}>
          <GrapeInput />
        </IntlProvider>,
      )
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
        <IntlProvider locale="en" messages={{}}>
          <GrapeInput
            onResize={onResize}
            onDidMount={onDidMount}
            content="[room](cg://chatgrape|room|1|/chat/slug)"
            focused
          />
        </IntlProvider>
      )
      render(grapeInput)
    })
  })
})
