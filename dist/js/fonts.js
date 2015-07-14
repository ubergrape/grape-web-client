"use strict";

var base = 13;

function calc(fontSize, lineHeight) {
  return {
    fontSize: base * fontSize + "px",
    lineHeight: base * lineHeight + "px"
  };
}

module.exports = {
  small: calc(0.75, 0.875),
  big: calc(1.25, 1.5),
  bigger: calc(1.6, 1.8),
  biggest: calc(2, 2.2),
  normal: calc(1, 1.5)
};