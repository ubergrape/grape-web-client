import React, {PropTypes, PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {LinkPreview} from '../link-previews'
import isEmpty from 'lodash/lang/isEmpty'
import {styles} from './linkPreviewsTheme'

@injectSheet(styles)
export default class LinkPreviews extends PureComponent {
  static propTypes = {
    previews: PropTypes.array.isRequired,
    sheet: PropTypes.object.isRequired
  }

  render() {
    const {
      previews,
      sheet: {classes}
    } = this.props

    return (
      <div>
        {previews.map(meta => (
          !isEmpty(meta) &&
            <LinkPreview
              {...meta}
              className={classes.linkPreview}
              key={meta.sourceUrl} />
          )
        )}
      </div>
    )
  }
}
