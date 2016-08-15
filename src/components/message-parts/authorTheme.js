import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {gray} from 'grape-theme/dist/base-colors'

export const styles = {
  author: {
    ...ellipsis,
    color: gray,
    marginRight: 10,
    cursor: 'pointer'
  }
}
