/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

// TODO: this really makes sense to upstream
module.exports = InfiniteScroll;

function InfiniteScroll(el, fn, margin) {
  this.elem = el;
  this.fn = fn;
  this.margin = margin || 10;
  this.reset();
  this.bind();
}

InfiniteScroll.prototype.bind = function InfiniteScroll_bind() {
  var self = this;
  var elem = this.elem;
  var fn = this.fn;
  elem.addEventListener('scroll', function () {
    var sT = elem.scrollTop;
    var sTM = elem.scrollTopMax || Math.max(elem.scrollHeight - elem.clientHeight, 0);
    if (!self._top && sT < self.margin) {
      self._top = true;
      fn('top', function () { self._top = false; });
    } else if (!self._bottom && sT > sTM - self.margin) {
      self._bottom = true;
      fn('bottom', function () { self._bottom = false; });
    }
  });
};

InfiniteScroll.prototype.reset = function InfiniteScroll_reset() {
  this._top = this._bottom = false;
};
