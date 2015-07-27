module.exports = isWebkit;

var isWebkit_;

function isWebkit() {
    if (typeof isWebkit_ === 'undefined') {
        var div = document.createElement('div');
        div.setAttribute('contenteditable', 'PLAINTEXT-ONLY');
        isWebkit_ = div.contentEditable === 'plaintext-only';
    }
    return isWebkit_;
}