import each from 'lodash/each'

import { maxSize } from './constants'

export const getFilesFromClipboard = ({ items }) => {
  const promises = []

  each(items, (item, index) => {
    if (item.kind !== 'file') return
    const file = item.getAsFile()

    if (!file) return

    const promise = new Promise(resolve => {
      // When clipboardData comes from a paste event and file is from fs,
      // there is a string item which contains the file name, before the blob.
      if (!file.name) {
        const prev = items[index - 1]
        if (prev && prev.kind === 'string') {
          prev.getAsString(name => {
            file.name = name
            resolve(file)
          })
          return
        }
        file.name = 'untitled'
      }

      resolve(file)
    })

    promises.push(promise)
  })

  return Promise.all(promises)
}

export const findAcceptedAndRejected = files => {
  const rejected = []
  const accepted = []
  files.forEach(file => {
    if (file.size <= maxSize) accepted.push(file)
    else rejected.push(file)
  })
  return { accepted, rejected }
}
