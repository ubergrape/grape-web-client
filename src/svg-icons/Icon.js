/* eslint-disable react/no-danger */
import React, {PropTypes} from 'react'
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
    const data = cache[name] = {}
    div.innerHTML = raw[name]
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

const Icon = ({sheet: {classes}, className, name}) => {
  const {html, attrs} = getData(name)
  return (
    <svg
      {...attrs}
      dangerouslySetInnerHTML={{__html: html}}
      className={cn(classes.icon, className)}
    />
  )
}

Icon.propTypes = {
  sheet: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string
}

Icon.defaultProps = {
  className: null
}

const styles = {
  icon: {
    isolate: false,
    display: 'inline-block',
    height: '1em',
    maxWidth: '100%',
    userSelect: 'none',
    fill: 'currentColor'
  }
}

export default injectSheet(styles)(Icon)
