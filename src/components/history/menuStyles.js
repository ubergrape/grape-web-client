import {link, button} from 'grape-theme/dist/web-colors'
import {gray, red} from 'grape-theme/dist/base-colors'
import buttonIcon from '../button/icon'

const item = {
  display: 'inline-block',
  padding: '3px 5px',
  border: `1px solid ${button}`,
  cursor: 'pointer',
  textAlign: 'center',
  lineHeight: 1
}

const firstItem = {
  ...item,
  borderRadius: '50% 0 0 50%',
  borderRight: 0,
  paddingLeft: 7
}

const lastItem = {
  ...item,
  borderRadius: '0 50% 50% 0',
  borderLeft: 0,
  paddingRight: 7
}

const iconOptions = {
  color: gray,
  hoverColor: link,
  iconOnly: true
}

export default {
  menu: {
    display: 'inline-block',
    position: 'absolute',
    top: 0,
    right: 0
  },
  itemEdit: {
    extend: [buttonIcon('pencil', iconOptions), firstItem]
  },
  itemCopyLink: {
    extend: [buttonIcon('iconLink', iconOptions), item]
  },
  itemRemove: {
    extend: [buttonIcon('remove', {...iconOptions, hoverColor: red}), lastItem]
  }
}
