#!/usr/bin/env node

var po2json = require('po2json');

var res = po2json.parseFileSync(process.argv[2], {format: 'raw'});

var out = Object.create(null);

Object.keys(res).forEach(function (key) {
	if (!key) return;
	out[key] = res[key][1]; // for whatever reason
});

console.log(JSON.stringify(out));
