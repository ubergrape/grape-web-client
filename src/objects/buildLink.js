import template from 'lodash/string/template'

// TODO Stop using global classes
export default template(`
  <a
    href="<%- url %>"
    class="ac animate <%- service %> <%- type %>"
    data-object="<%- str %>"
    tabindex="-1">
    <%- content %>
  </a>
`)
