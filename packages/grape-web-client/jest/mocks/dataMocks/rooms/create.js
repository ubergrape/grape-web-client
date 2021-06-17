// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker'
import moment from 'moment'

import { generateArray } from '../../../helpers'

export const create = () => {
  const product = faker.commerce.product()
  const creator = faker.datatype.number()

  return {
    abbr: faker.hacker.abbreviation(),
    color: faker.internet.color(),
    created: moment(faker.datatype.datetime()).format(
      'YYYY-MM-DDTHH:mm:ss.SSSSSSZ',
    ),
    creator,
    description: faker.commerce.productDescription(),
    icon: '',
    id: faker.datatype.number(),
    invites: [],
    isManaged: faker.datatype.boolean(),
    isPublic: faker.datatype.boolean(),
    name: product,
    referenceLabel: null,
    referenceUrl: null,
    slug: product
      .toLowerCase()
      .split(' ')
      .join('-'),
    type: 'room',
    users: [creator, ...generateArray(faker.datatype.number, 3)],
  }
}
