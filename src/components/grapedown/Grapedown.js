import createRender from './createRender'

const render = createRender()

export default function Grapedown(props) {
  return render(props.text)
}
