import each from 'lodash/collection/each'

export const getFilesFromClipboard = ({items}) => {
  const promises = []

  each(items, (item, index) => {
    if (item.kind !== 'file') return
    const file = item.getAsFile()
    if (!file) return
    // In case it is a paste from the memory, there is no file name.
    // Set a default one.
    file.name = 'untitled'
    let promise
    // When clipboardData comes from a paste event and file is from fs,
    // there is a string item which contains the file name, before the blob.
    const prev = items[index - 1]
    if (prev && prev.kind === 'string') {
      const promise = new Promise(resolve => {
        prev.getAsString(name => {
          file.name = name
          resolve(file)
        })
      })
      return
    }

    promises.push(promise || file)
  })

  return Promise.all(promises)
}
