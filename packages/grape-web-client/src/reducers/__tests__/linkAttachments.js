import linkAttachments from '../linkAttachments'
import {
  SHOW_REMOVE_LINK_ATTACHMENT,
  HIDE_REMOVE_LINK_ATTACHMENT,
} from '../../constants/actionTypes'

describe('linkAttachments reducer', () => {
  it('should handle SHOW_REMOVE_LINK_ATTACHMENT', () => {
    expect(
      linkAttachments(
        { show: false },
        {
          type: SHOW_REMOVE_LINK_ATTACHMENT,
          payload: {
            channelId: 666,
            messageId: 'dfsdfv3432sdfk234',
            url: 'https://google.com',
            isAdmin: true,
          },
        },
      ),
    ).toMatchSnapshot()
  })

  it('should handle HIDE_REMOVE_LINK_ATTACHMENT', () => {
    expect(
      linkAttachments({ show: true }, { type: HIDE_REMOVE_LINK_ATTACHMENT }),
    ).toMatchSnapshot()
  })
})
