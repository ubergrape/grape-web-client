import PropTypes from 'prop-types'
import React from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'
import ListItem from 'grape-web/lib/components/list/listItem'
import ListItemIcon from 'grape-web/lib/components/list/listItemIcon'
import ListItemText from 'grape-web/lib/components/list/listItemText'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'
import fonts from 'grape-theme/dist/fonts'

const styles = ({ palette }) => ({
  root: {
    padding: [sizes.spacer.xs, sizes.spacer.m],
    color: palette.blueGrey[70],
    '&:hover': {
      isolate: false,
      background: 'none',
      '& $icon': {
        isolate: false,
        color: palette.secondary.A200,
      },
      '& $text': {
        isolate: false,
        color: palette.text.primary,
      },
    },
  },
  icon: {
    cursor: 'inherit',
    marginRight: sizes.spacer.s,
    color: palette.text.primary,
  },
  text: {
    cursor: 'inherit',
    padding: 0,
    extend: fonts.small,
    color: palette.text.secondary,
  },
})

const Action = ({ classes, icon, onClick, children }) => {
  const renderText = (...content) => (
    <ListItemText
      secondary={content}
      className={classes.text}
      disableTypography
    />
  )

  return (
    <ListItem button onClick={onClick} className={classes.root}>
      <ListItemIcon>
        <Icon name={icon} className={classes.icon} />
      </ListItemIcon>
      {children({ renderText })}
    </ListItem>
  )
}

Action.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
}

export default injectSheet(styles)(Action)
