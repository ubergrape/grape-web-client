'use strict'

import React from 'react'

var Smartcomplete = React.createClass({
  render: function () {
    return (
      <div></div>
    )
  }
})

/**
 * Render smartcomplete as a component when used bundled with react.
 *
 * @param {Element}
 * @api public
 */
Smartcomplete.create = function (element) {
  return React.render(<Smartcomplete />, element)
}

export default Smartcomplete

