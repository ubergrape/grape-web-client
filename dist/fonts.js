"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function get(fontSize, lineHeight) {
  return {
    fontSize: fontSize,
    lineHeight: 1.5
  };
}

exports["default"] = {
  smaller: get(11),
  small: get(13),
  normal: get(15),
  big: get(17),
  bigger: get(19),
  biggest: get(21)
};
module.exports = exports["default"];