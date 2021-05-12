import getButtonProps from '../../getButtonProps'
import messages from '../../messages'
import { vc1, vc2, vc6 } from '../data'

jest.mock('../../../../../utils/is-chrome-or-firefox', () => false)

describe('getButtonProps', () => {
  it('getButtonProps should return camera button if there is no video conference yet in this channel and the user is not already in a call in another channel', () => {
    expect(getButtonProps(vc1)).toEqual({
      icon: 'camera',
      type: 'button',
      className: 'camera',
      message: messages.joinConference,
      onClick: 'showVideoConferenceWarning',
    })
  })

  it('getButtonProps should return active camera button if ongoing video conference in this channel and the user is not already in a call in another channel', () => {
    expect(getButtonProps(vc2)).toEqual({
      icon: 'cameraActive',
      type: 'button',
      className: 'cameraActive',
      message: messages.joinConference,
      onClick: 'showVideoConferenceWarning',
    })
  })

  it('getButtonProps should return active camera link if ongoing video conference in this channel and the user is already in a call in this channel', () => {
    expect(getButtonProps(vc6)).toEqual({
      icon: 'cameraActive',
      type: 'button',
      className: 'cameraActive',
      message: messages.joinConference,
      onClick: 'showVideoConferenceWarning',
    })
  })
})
