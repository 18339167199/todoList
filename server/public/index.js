console.log('js 加载')

const div = document.createElement('div')

div.innerHTML = 'JS 文件加载完毕'

div.setAttribute('style', 'font-size: 18px; color: red; text-align: center; padding: 20px;')

const body = document.getElementsByTagName('body')[0]

body.insertBefore(div, body.children[0])
