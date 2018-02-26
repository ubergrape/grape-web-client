import React from 'react'
import omit from 'lodash/object/omit'
import findMatches from 'grape-web/lib/search/findMatches'

import Highlight from '../../highlight/YellowHighlight'
import {render, renderers, nonStandardProps} from '../../grapedown'

const {renderTag} = renderers
const omitProps = [...nonStandardProps, 'href']

export default function createGrapedownWithSearch(initialProps) {
  const {query} = initialProps

  const renderProps = {
    renderTag: (tag, props, children) => {
      if (typeof children[0] !== 'string' && children.length === 1) {
        return renderTag(tag, props, children)
      }

      const highlightedChildren = children.reduce((parts, child) => {
        if (typeof child !== 'string') {
          parts.push(child)
          return parts
        }
        const matches = findMatches(child, query)
        const foundMatches = matches.filter(({found}) => found)

        if (!foundMatches.length) {
          parts.push(renderTag(tag, {...props, key: `a-${parts.length}`}, [child]))
          return parts
        }

        matches.forEach((match) => {
          if (match.found) {
            parts.push(<Highlight key={`b-${parts.length}`}>{match.text}</Highlight>)
            return
          }
          parts.push(match.text)
        })

        return parts
      }, [])

      return (
        <span {...omit(props, omitProps)}>
          {highlightedChildren}
        </span>
      )
    }
  }

  return props => render({...initialProps, ...props, ...renderProps})
}
