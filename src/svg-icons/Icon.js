import PropTypes from 'prop-types'
/* eslint-disable react/no-danger */
import React from 'react'
import cn from 'classnames'

import * as raw from './raw'
import injectSheet from '../jss'

/**
 * Currently our svgs are strings.
 * To render svg as a component without wrappers, we need to extract
 * the inner contents of svg tag and its attributes.
 */
const getData = (() => {
  const div = document.createElement('div')
  const cache = {}
  const attrNames = ['width', 'height', 'viewBox', 'xmlns']

  return (name) => {
    if (cache[name]) return cache[name]
    const data = {}
    cache[name] = data
    // Name might be icon name or svg string.
    div.innerHTML = raw[name] || name
    const svg = div.firstChild
    data.html = svg.innerHTML
    data.attrs = attrNames.reduce((attrs, attr) => {
      // eslint-disable-next-line no-param-reassign
      attrs[attr] = svg.getAttribute(attr)
      return attrs
    }, {})
    return data
  }
})()

const Icon = ({classes, className, name, svg, ...rest}) => {
  const {html, attrs} = getData(name || svg)
  // eslint-disable-next-line no-param-reassign
  delete rest.sheet
  return (
    <svg
      {...attrs}
      dangerouslySetInnerHTML={{__html: html}}
      className={cn(classes.icon, className)}
      {...rest}
    />
  )
}

Icon.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  svg: PropTypes.string,
  className: PropTypes.string
}

Icon.defaultProps = {
  className: undefined,
  name: undefined,
  svg: undefined
}

const styles = {
  icon: {
    isolate: false,
    display: 'inline-block',
    height: '1em',
    width: 'auto',
    maxWidth: '100%',
    userSelect: 'none',
    fill: 'currentColor'
  }
}

export default injectSheet(styles)(Icon)
