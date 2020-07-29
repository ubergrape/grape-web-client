import getButtonProps from '../getButtonProps'
import messages from '../messages'
import { vc1, vc2 } from './data'

jest.mock('../../../../utils/is-chrome-or-firefox', () => true)

describe('getButtonProps ', () => {
  it('getButtonProps should return camera link if there is no video conference yet in this channel and the user is not already in a call in another channel', () => {
    expect(getButtonProps(vc1)).toEqual({
      icon: 'camera',
      type: 'link',
      className: 'camera',
      message: messages.joinConference,
      link: vc1.channel.grapecallUrl,
    })
  })

  it('getButtonProps should return active camera link if ongoing video conference in this channel and the user is not already in a call in another channel', () => {
    expect(getButtonProps(vc2)).toEqual({
      icon: 'cameraActive',
      type: 'link',
      className: 'cameraActive',
      message: messages.joinConference,
      link: vc2.channel.grapecallUrl,
    })
  })
})
