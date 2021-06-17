import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import ListItem from 'grape-web/lib/components/list/listItem'
import injectSheet from 'grape-web/lib/jss'
import { small } from 'grape-theme/dist/fonts'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import { grayLighter, gray } from 'grape-theme/dist/base-colors'
import SvgIcon from 'grape-web/lib/svg-icons/Icon'
import { icon as iconSize } from 'grape-theme/dist/sizes'

import { defaultServiceIcon } from '../../../../../constants/images'

const styles = {
  item: {
    padding: [5, 10],
    '&:hover': {
      background: grayLighter,
    },
    '&, *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  icon: {
    width: iconSize.s,
    height: iconSize.s,
    color: gray,
  },
  defaultIcon: {
    composes: '$icon',
    background: {
      repeat: 'no-repeat',
      size: 'cover',
      image: `url("${defaultServiceIcon}")`,
    },
  },
  text: {
    extend: [small, ellipsis],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    padding: [0, 10],
  },
}

const Icon = ({ icon, classes }) => {
  if (icon) {
    return <SvgIcon name={icon} className={classes.icon} />
  }

  return <div className={classes.defaultIcon} />
}

@injectSheet(styles)
export default class ServiceItem extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    service: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
    icon: PropTypes.string,
  }

  onSelect = () => {
    const { service, onSelect } = this.props
    onSelect(service)
  }

  render() {
    const {
      classes,
      service: { id, name },
      icon,
    } = this.props

    return (
      <ListItem className={classes.item}>
        <Icon classes={classes} icon={icon} id={id} />
        <div className={classes.text} onClick={this.onSelect}>
          {name}
        </div>
      </ListItem>
    )
  }
}
