import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import getSvg from '../getSvg'

jest.mock('grape-web/lib/svg-icons/getColored')

describe('history reducer', () => {
  // Mock getColoredIcon since in JSDom every result would be the same.
  getColoredIcon.mockImplementation(params => params)

  it('should use file icon as default', () => {
    expect(getSvg('default')).toMatchSnapshot()
  })

  it('should use file icon if icon is not available', () => {
    expect(getSvg()).toMatchSnapshot()
  })

  it('should use provided icon if available', () => {
    expect(getSvg('bell')).toMatchSnapshot()
  })
})
