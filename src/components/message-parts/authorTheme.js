import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {gray} from 'grape-theme/dist/base-colors'
import {small, normal} from 'grape-theme/dist/fonts'

export const styles = {
  author: {
    extend: [small, ellipsis],
    lineHeight: 1.7,
    color: gray,
    marginRight: 10,
    fontWeight: 'bold'
  }
}
