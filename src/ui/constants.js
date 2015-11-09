import staticUrl from 'staticurl'

const imagesBase = staticUrl('app/cg/images')

export const images = {
  emojiSheet: imagesBase + '/emoji_sheet_32_optimized.png',
  traubyReading: imagesBase + '/trauby-reading.png',
  traubyJuggling: imagesBase + '/trauby-juggling.png',
  noDetail: imagesBase + '/no-detail.png',
  spinner: staticUrl('/images/preloader-onwhite.gif')
}
