'use strict'

import './src/setup'
import Smartcomplete from './src/core/Smartcomplete'

// export * from './src/core/Smartcomplete'
export default Smartcomplete

// Register reactive element.
if (document.registerReact) {
    document.registerReact('smart-complete', Smartcomplete);
}
