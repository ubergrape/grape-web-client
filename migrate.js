var recursive = require('recursive-readdir')
var fs = require('fs')
var path = require('path')

var target = process.argv[2]

if (/\.js$/.test(target)) {
  handle(path.resolve(process.env.PWD, target))
}
else {
  readDir(target)
}

function readDir(dir) {
  recursive(dir, function (err, files) {
    files = files.filter(function (file) {
      return /\.js$/.test(file)
    })
    // Files is an array of filename
    files.forEach(handle)
  })
}

function handle(file) {
  var src = fs.readFileSync(file, 'utf8')

  src = src.replace(/\t/g, '  ')
  src = src.replace(/;\n/g, '\n')
  src = src.replace(/"use strict"\n\n/g, '')
  src = src.replace(/'use strict'\n\n/g, '')
  src = src.replace(/"use strict"\n/g, '')
  src = src.replace(/'use strict'\n/g, '')
  src = src.replace(/\/\* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : \*\/\n/g, '')
  src = src.replace(/var /g, 'let ')
  src = src.replace(/ == /g, ' === ')
  src = src.replace(/function[\s]*\((.*)\)[\s]*{/g, 'function ($1) {')
  if (src[src.length - 1] !== '\n') src += '\n'

  fs.writeFileSync(file, src, 'utf8')
}