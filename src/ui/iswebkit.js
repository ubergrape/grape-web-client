module.exports = isWebkit

let isWebkit_

function isWebkit() {
    if (typeof isWebkit_ === 'undefined') {
        let div = document.createElement('div')
        div.setAttribute('contenteditable', 'PLAINTEXT-ONLY')
        isWebkit_ = div.contentEditable === 'plaintext-only'
    }
    return isWebkit_
}