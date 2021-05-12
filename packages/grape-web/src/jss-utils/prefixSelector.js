import vendor from 'css-vendor'

const prefixes = {
  '::input-placeholder': `::${vendor.prefix.css}input-placeholder`,
}

if (vendor.prefix.css === '-moz-') {
  prefixes['::input-placeholder'] = '::-moz-placeholder'
}

if (vendor.prefix.css === '-ms-') {
  prefixes['::input-placeholder'] = ':-ms-input-placeholder'
}

export default selector => prefixes[selector]
