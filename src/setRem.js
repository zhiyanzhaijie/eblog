export const setDomFontSize = () => {
  let width = document.documentElement.clientWidth || document.body.clientWidth
  let fontSize = (width <= 1200 ? 1200 : width) / 100 + 'px'
  document.getElementsByTagName('html')[0].style['font-size'] = fontSize
}

window.addEventListener('resize', setDomFontSize)
