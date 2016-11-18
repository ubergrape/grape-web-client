import defaultDeep from 'lodash/object/defaultsDeep'

import {gray, grayLighter} from 'grape-theme/dist/base-colors'
import {bigger, small} from 'grape-theme/dist/fonts'
import {borderDefault} from 'grape-theme/dist/web-colors'
// TODO #149 use generic styles instead of importing the following
import {styles as messageStyles} from '../history/messages/baseMessageTheme'

const hoverStyles = {
  opacity: 0.8,
  // TODO remove this when legacy/global CSS is gone
  cursor: 'pointer',
  font: 'inherit'
}

export const dialogStyles = {
  wrapper: {
    padding: 20,
    borderTop: `3px solid ${borderDefault}`,
    maxHeight: '80vh',
    overflowY: 'auto'
  }
}

export const linkStyles = {
  button: {
    color: gray,
    cursor: 'pointer',
    border: 0,
    font: 'inherit',
    padding: 0,
    textDecoration: 'underline',
    '&:hover': hoverStyles,
    '&:focus': hoverStyles
  }
}

const codeStyles = {
  width: 'auto',
  display: 'block',
  padding: 10
}

export const tipsStyles = {
  section: {
    marginTop: 20,
    paddingTop: 20,
    borderTop: `1px solid ${grayLighter}`,
    '&:first-child': {
      marginTop: 0
    }
  },
  title: {
    extend: [bigger],
    marginBottom: 5
  },
  subheading: {
    extend: [small],
    fontStyle: 'italic',
    margin: [[20, 0, 5]],
    textTransform: 'capitalize',
    color: gray
  },
  example: defaultDeep(
    codeStyles,
    {
      whiteSpace: 'pre-line',
      backgroundColor: grayLighter
    },
    messageStyles.content['& code']
  ),
  renderedExample: defaultDeep(
    {
      '& p': {
        marginBottom: 10
      },
      '& pre code': codeStyles
    },
    messageStyles.content
  )
}
