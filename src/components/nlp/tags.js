// We don't expect the amount of tags will be bigger than 90.
const amount = 90
const prefix = '0x1000'

const tags = []

for (let i = 0; i < amount; i++) {
  tags.push(prefix + i)
}

export default tags
