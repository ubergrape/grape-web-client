// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker'
import moment from 'moment'

import { generateArrayOfObjects } from '../../../helpers'

export const getRoom = () => {
  const product = faker.commerce.product()

  return {
    abbr: faker.hacker.abbreviation(),
    calls: faker.datatype.array(),
    color: faker.internet.color(),
    created: moment(faker.datatype.datetime()).format(
      'YYYY-MM-DDTHH:mm:ss.SSSSSSZ',
    ),
    creator: faker.datatype.number(),
    description: faker.commerce.productDescription(),
    grapecallUrl: faker.internet.url(),
    icon: '',
    id: faker.datatype.number(),
    isEncrypted: faker.datatype.boolean(),
    isManaged: faker.datatype.boolean(),
    isPublic: faker.datatype.boolean(),
    manageMembersUrl: faker.internet.url(),
    membersCount: faker.datatype.number(),
    membership: faker.datatype.boolean(),
    name: product,
    notifyRoom: faker.datatype.boolean(),
    organization: faker.datatype.number(),
    referenceLabel: null,
    referenceUrl: null,
    slug: product
      .toLowerCase()
      .split(' ')
      .join('-'),
    type: 'room',
    videoconferenceUrl: faker.internet.url(),
  }
}

export const getRooms = length => ({
  results: generateArrayOfObjects(getRoom, length),
})
