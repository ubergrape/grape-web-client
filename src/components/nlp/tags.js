// We don't expect the amount of tags will be bigger than 90.
const amount = 90
let start = 0x10000

const tags = []

for (let i = 0; i < amount; i++) {
  tags.push(String.fromCharCode(++start))
}

export default tags
