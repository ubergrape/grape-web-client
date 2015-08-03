import React from 'react'

export function basic() {
  return {
    title: <h2>Write what you are looking for or use one of the filters on the left.</h2>,
    description: <p>You can write <b>"#filename"</b> for example or a type like <b>"#task"</b>. If you want to browse a specific service, start typing the filter name like <b>"#filter"</b> for example.</p>,
    ok: true
  }
}

export function canAdd(data) {
  return {
    title: <h2>Time to connect some Deep Service Integrations!</h2>,
    description: <p>{data.orgName} needs a couple of integrations, for the best autocomplete experience.</p>,
    ok: false
  }
}

export function needsHelp(data) {
  let ret = canAdd(data)
  ret.description.props.children.push(<p>Ask a team member with proper permissions (like {data.orgOwner}) to add them!</p>)
  return ret
}
