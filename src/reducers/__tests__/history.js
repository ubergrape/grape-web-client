import history from '../history'
import { UNSET_HISTORY_SCROLL_TO } from '../../constants/actionTypes'

describe('history reducer', () => {
  it('should handle UNSET_HISTORY_SCROLL_TO', () => {
    expect(
      history(
        { scrollToAlignment: 'end', scrollTo: 'abc' },
        { type: UNSET_HISTORY_SCROLL_TO },
      ),
    ).toEqual({ scrollToAlignment: null, scrollTo: null })
  })
})
