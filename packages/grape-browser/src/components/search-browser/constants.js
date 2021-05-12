import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import colors from 'grape-theme/dist/base-colors'

export const listTypes = ['results', 'actions', 'services']

const plusIcon = getColoredIcon({ name: 'plus', color: colors.blue })
export const plusIconStyle = {
  display: 'inline-block',
  background: `no-repeat center url('${plusIcon}')`,
  backgroundColor: colors.white,
  backgroundSize: '60%',
  border: `1px solid ${colors.grayLight}`,
  borderRadius: '20%',
  verticalAlign: 'middle',
}
