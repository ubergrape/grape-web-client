import injectSheet, {jss} from 'react-jss'
import isolate from 'jss-isolate'

jss.use(isolate({
  reset: {
    'font-family': '"proxima-nova", "Helvetica Neue", Arial, Helvetica, sans-serif',
    'box-sizing': 'border-box'
  }
}))

export {jss}
export default injectSheet
