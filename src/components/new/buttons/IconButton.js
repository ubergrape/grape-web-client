import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../icon'
import theme from '../../../constants/theme'

import styles from './styles/IconButtonStyles'

const IconButton = ({ classes, name, onClick, children }) => (
  <div className={classes.wrapper}>
    <button onClick={onClick} className={classes.button}>
      <Icon
        name={name}
        isHoverable
        styles={{
          width: 32,
          height: 32,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: theme.borderRadiusButtonPillWeb,
          border: `1px solid ${theme.colorBackgroundButtonIntensePrimary}`,
          cursor: 'pointer',
          fill: 'currentColor',
          color: theme.colorBackgroundButtonIntensePrimary,
        }}
      />
    </button>
    <span className={classes.text}>{children}</span>
  </div>
)

export default injectSheet(styles)(IconButton)
