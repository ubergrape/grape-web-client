import expect from 'expect.js'
import {create} from '../'

describe('objects: Search', () => {
  const object = create('search', {
    id: '8b37ec07b198be90e8086e1065821492',
    service: 'googledrive',
    url: '(https://docs.google.com/a/ubergrape.com(/folderview?id=0B_TCKOxiyU4wNTBkNWZiNzAtZTVjZS00ZGUzLWI2ZjItZTNmMThmZjhjMDZj&usp=drivesdk)',
    type: 'file',
    name: '>"Plans/Discussions"'
  })

  describe('Search#toString', () => {
    it('should return correct md', () => {
      expect(object.toString()).to.be('[>"Plans/Discussions"](cg://googledrive|file|8b37ec07b198be90e8086e1065821492|%28https://docs.google.com/a/ubergrape.com%28/folderview?id=0B_TCKOxiyU4wNTBkNWZiNzAtZTVjZS00ZGUzLWI2ZjItZTNmMThmZjhjMDZj&usp=drivesdk%29||)')
    })
  })
})
