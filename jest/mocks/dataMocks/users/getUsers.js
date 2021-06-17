// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker'
import moment from 'moment'

import { getRandomElement, generateArrayOfObjects } from '../../../helpers'

import { userStatusMap, userRolesMap } from '../../../../src/constants/app'

export const getUser = dataToOverwrite => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  return {
    avatar: faker.image.imageUrl(),
    displayName: `${firstName} ${lastName}`,
    email: faker.internet.email(),
    firstName,
    hideEmailField: faker.datatype.boolean(),
    highlighted: `${firstName} <em>${lastName}</em>`,
    id: faker.datatype.number(),
    isActive: faker.datatype.boolean(),
    lastMessageTimestamp: moment(faker.datatype.datetime()).format(
      'YYYY-MM-DDTHH:mm:ss.SSSSSSZ',
    ),
    lastName,
    phoneNumber: faker.phone.phoneNumber(),
    pm: faker.datatype.number(),
    role: getRandomElement(Object.values(userRolesMap)),
    skypeForBusiness: faker.internet.email(),
    skype_username: faker.internet.userName(),
    status: parseInt(getRandomElement(Object.keys(userStatusMap)), 10),
    title: faker.name.jobTitle(),
    username: faker.internet.userName(),
    whatIDo: faker.name.jobDescriptor(),
    ...dataToOverwrite,
  }
}

export const getUsers = data => ({
  // eslint-disable-next-line no-underscore-dangle
  results: global.__TEST_EMPTY_RESULTS__
    ? []
    : generateArrayOfObjects(
        getUser,
        // eslint-disable-next-line no-underscore-dangle
        global.__TEST_RESULTS_LENGTH__ || data.args[1].pageSize,
      ),
})
