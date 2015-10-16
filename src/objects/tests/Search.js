import expect from 'expect.js'
import {create} from '../'

describe('objects: Search', () => {
  let object = create('search', {
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

  describe('Search#toHTML', () => {
    it('should return correct html', () => {
      expect(object.toHTML().replace(/\s/g, '')).to.be(`
        <a
          tabindex="-1"
          target="_blank"
          href="(https://docs.google.com/a/ubergrape.com(/folderview?id=0B_TCKOxiyU4wNTBkNWZiNzAtZTVjZS00ZGUzLWI2ZjItZTNmMThmZjhjMDZj&amp;usp=drivesdk)"
          data-object="[&gt;&quot;Plans/Discussions&quot;](cg://googledrive|file|8b37ec07b198be90e8086e1065821492|%28https://docs.google.com/a/ubergrape.com%28/folderview?id=0B_TCKOxiyU4wNTBkNWZiNzAtZTVjZS00ZGUzLWI2ZjItZTNmMThmZjhjMDZj&amp;usp=drivesdk%29||)"
          data-result="{&quot;id&quot;:&quot;8b37ec07b198be90e8086e1065821492&quot;,&quot;service&quot;:&quot;googledrive&quot;,&quot;url&quot;:&quot;(https://docs.google.com/a/ubergrape.com(/folderview?id=0B_TCKOxiyU4wNTBkNWZiNzAtZTVjZS00ZGUzLWI2ZjItZTNmMThmZjhjMDZj&amp;usp=drivesdk)&quot;,&quot;type&quot;:&quot;file&quot;,&quot;name&quot;:&quot;&gt;\\&quot;Plans/Discussions\\&quot;&quot;}"
          class="ac animate service-googledrive type-googledrivefile">
          &gt;&quot;Plans/Discussions&quot;
        </a>
      `.replace(/\s/g, ''))
    })
  })
})
