import PropTypes from 'prop-types'
import React, { Component } from 'react'
import pick from 'lodash/pick'
import { shouldPureComponentUpdate } from 'react-pure-render'
import { defineMessages, injectIntl } from 'react-intl'

import SectionHeader from '../../section-header/SectionHeader'

const labels = defineMessages({
  emoticons: {
    id: 'emojiEmoticons',
    defaultMessage: 'emoticons',
  },
  nature: {
    id: 'emojiNature',
    defaultMessage: 'nature',
  },
  objects: {
    id: 'emojiObjects',
    defaultMessage: 'objects',
  },
  places: {
    id: 'emojiPlaces',
    defaultMessage: 'places',
  },
  other: {
    id: 'emojiOther',
    defaultMessage: 'other',
  },
})

/**
 * One grid section which has a title and items.
 */
class Section extends Component {
  static propTypes = {
    onDidMount: PropTypes.func,
    onItemDidMount: PropTypes.func,
    Item: PropTypes.func,
    items: PropTypes.array,
    label: PropTypes.string,
    hint: PropTypes.string,
    contentClassName: PropTypes.string,
    focused: PropTypes.bool,
  }

  static defaultProps = {
    contentClassName: '',
  }

  constructor(props) {
    super(props)
    this.items = {}
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onItemDidMount = item => {
    this.items[item.props.id] = item
  }

  onItemWillUnmount = item => {
    delete this.items[item.props.id]
  }

  getContentComponent() {
    return this.refs.content
  }

  render() {
    const {
      Item,
      intl: { formatMessage },
    } = this.props

    return (
      <section>
        <SectionHeader
          text={formatMessage(labels[this.props.label])}
          hint={this.props.hint}
        />
        <div className={this.props.contentClassName} ref="content">
          {this.props.items.map((data, i) => {
            const props = pick(
              this.props,
              'onFocus',
              'onSelect',
              'onInvisible',
              'visibilityContainment',
            )
            return (
              <Item
                {...data}
                {...props}
                sectionFocused={this.props.focused}
                key={`item${i}`}
                onDidMount={this.onItemDidMount}
                onWillUnmount={this.onItemWillUnmount}
              />
            )
          })}
        </div>
      </section>
    )
  }
}

export default injectIntl(Section)
