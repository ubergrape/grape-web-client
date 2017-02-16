import React from 'react'

import {renderSheetsInsertionPoints} from '../../app'
import {AppProvider} from '../app'

renderSheetsInsertionPoints()

export default props => <AppProvider {...props} />
