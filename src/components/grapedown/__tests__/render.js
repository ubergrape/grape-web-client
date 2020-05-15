import React from 'react'
import { render, cleanup } from 'react-testing-library'
import '@testing-library/jest-dom/extend-expect' // this add custom jest matchers from jest-dom
import Render from '../render'

afterEach(cleanup)

test('Render a simple hello text', () => {
  const { container } = render(<Render text="Hello" />)
  expect(container).toMatchSnapshot()
})

test('Render an emoji', () => {
  const { container } = render(<Render text="👩🏽‍🚒" />)
  expect(container).toMatchSnapshot()
})

test('Render an emoji image based on the emoji string', () => {
  const { container } = render(<Render text=":female-firefighter:" />)
  expect(container).toMatchSnapshot()
})
