import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {gray} from 'grape-theme/dist/base-colors'
import {small} from 'grape-theme/dist/fonts'

export const styles = {
  author: {
    extend: [small, ellipsis],
    color: gray,
    marginRight: 10,
    fontWeight: 'bold'
  }
}
