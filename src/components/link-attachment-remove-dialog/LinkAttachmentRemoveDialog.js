import React, {PropTypes, PureComponent} from 'react'
import parseUrl from 'grape-web/lib/parse-url'
import injectSheet from 'grape-web/lib/jss'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import Dialog from '../dialog/Dialog'
import {styles} from './theme'

const messages = defineMessages({
  title: {
    id: 'markdownTipsDialogTitle',
    defaultMessage: 'Markdown tips'
  }
})

const getInitialState = () => ({
  type: 0,
  isChecked: false
})

@injectSheet(styles)
@injectIntl
export default class LinkAttachmentRemoveDialog extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    onHide: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    id: PropTypes.number,
    messageId: PropTypes.string
  }

  static defaultProps = {
    id: null,
    messageId: null
  }

  state = getInitialState()

  componentWillReceiveProps(nextProps) {
    if (!nextProps.show) {
      this.setState(getInitialState())
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const {type} = this.state
    const {
      id,
      messageId,
      url,
      onRemove,
      onHide
    } = this.props

    onRemove({
      id,
      messageId,
      type,
      url: type === 1 ? parseUrl(url).host : url
    })
    onHide()
  }

  onCancel = (e) => {
    e.preventDefault()
    this.props.onHide()
  }

  onCheck = () => {
    this.setState({
      isChecked: !this.state.isChecked,
      type: this.state.isChecked ? 0 : this.state.type
    })
  }

  onSelect = (e) => {
    this.setState({
      type: Number(e.target.value)
    })
  }

  renderAdminForm() {
    const {isChecked} = this.state

    return (
      <fieldset>
        <label>
          <input
            type="checkbox"
            name="attachment_org"
            checked={isChecked}
            onChange={this.onCheck}
          />
          Disable future attachments from this website?
        </label>
        <label>
          select an option
          <select
            name="type"
            disabled={!isChecked}
            onChange={this.onSelect}
          >
            <option value="1">all links from this domain</option>
            <option value="2">just this url</option>
          </select>
        </label>
      </fieldset>
    )
  }

  render() {
    const {
      intl: {formatMessage},
      sheet: {classes},
      show,
      id,
      url,
      isAdmin,
      onHide
    } = this.props

    return (
      <Dialog
        show={show}
        onHide={onHide}
        title={formatMessage(messages.title)}
      >
        {url}
        <form
          method="post"
          onSubmit={this.onSubmit}
          className={classes.wrapper}
        >
          {isAdmin && this.renderAdminForm()}
          <button onClick={this.onCancel}>cancel</button>
          <button type="submit">onRemove</button>
        </form>
      </Dialog>
    )
  }
}
