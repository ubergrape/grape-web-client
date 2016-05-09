export function hide() {
  const intercom = window.Intercom
  intercom('hide')
}

export function show() {
  const intercom = window.Intercom
  intercom('show')
}

export const settings = window.intercomSettings
