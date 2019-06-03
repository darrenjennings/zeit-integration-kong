import { htm as html } from '@zeit/integration-utils'

const StatusDotStyle = {
  width: '10px',
  height: '10px',
  borderRadius: '6px',
  marginRight: '5px'
}

export const StatusDot = ({ color: color_, title, marginTop = '0px' }) => {
  let color = '#ccc'

  if (color_ === 'green') {
    color = '#1EDA9A'
  }
  if (color_ === 'yellow') {
    color = '#f7cd54'
  }
  if (color_ === 'red') {
    color = '#DA2929'
  }

  const style = {
    ...StatusDotStyle,
    marginTop
  }

  return html`
    <Box ...${style} backgroundColor=${color} title=${title || color} />
  `
}
