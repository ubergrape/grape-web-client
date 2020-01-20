import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Normalize from 'grape-web/lib/components/normalize'
import Modal from 'react-overlays/lib/Modal'
import injectSheet from 'grape-web/lib/jss'
import IconButton from 'grape-web/lib/components/icon-button'
import Icon from 'grape-web/lib/svg-icons/Icon'

import theme from './theme'

class Dialog extends PureComponent {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    width: PropTypes.number,
    sheet: PropTypes.object.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  }

  static defaultProps = {
    width: 526,
  }

  render() {
    const {
      sheet: { classes },
      show,
      onHide,
      title,
      width,
      children,
    } = this.props

    return (
      <Modal
        show={show}
        className={classes.modal}
        backdropClassName={classes.backdrop}
        onHide={onHide}
        autoFocus={false}
      >
        <Normalize
          className={classes.content}
          style={{ width, marginLeft: -width / 2 }}
        >
          <header className={classes.header}>
            <h2 className={classes.title}>{title}</h2>
            <IconButton className={classes.close} onClick={onHide}>
              <Icon name="close" />
            </IconButton>
          </header>
          <div className={classes.body}>{children}</div>
        </Normalize>
      </Modal>
    )
  }
}

export default injectSheet(theme)(Dialog)
