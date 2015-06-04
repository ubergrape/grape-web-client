#!/usr/bin/env node

var path = require('path')
var fs = require('fs')
var meta = require('emojione/emoji.json')


meta = Object.keys(meta).map(function (name) {
  return {
    name: name,
    cat: meta[name].category
  }
})

const DEST = path.join(__dirname, '..', '/src/emoji/meta.json')

fs.writeFileSync(DEST, JSON.stringify(meta))

console.log('File %s succesfully generated.', DEST)
