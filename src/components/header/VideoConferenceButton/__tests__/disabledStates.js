import getButtonProps from '../getButtonProps'
import messages from '../messages'
import { vc3, vc4, vc5 } from './data'

describe('getButtonProps', () => {
  it('getButtonProps should return disabled camera button for 1:1 call if there is no video conference yet in this channel and the user is not already in a call in another channel, but partner is busy', () => {
    expect(getButtonProps(vc3)).toEqual({
      icon: 'camera',
      type: 'button',
      className: 'disabledCamera',
      message: messages.inCall,
      onClick: 'showOnCallToast',
    })
  })

  it('getButtonProps should return disabled camera button if there is no video conference yet in this channel, but user participating in another call and there is no ongoing call in current channel', () => {
    expect(getButtonProps(vc4)).toEqual({
      icon: 'camera',
      type: 'button',
      className: 'disabledCamera',
      message: messages.anotherCall,
      onClick: 'showOnAnotherCallToast',
    })
  })

  it('getButtonProps should return disabled camera button if there is no video conference yet in this channel, but user participating in another call and there is ongoing call in current channel', () => {
    expect(getButtonProps(vc5)).toEqual({
      icon: 'cameraActive',
      type: 'button',
      className: 'disabledCamera',
      message: messages.inCall,
      onClick: 'showOnAnotherCallToast',
    })
  })
})
