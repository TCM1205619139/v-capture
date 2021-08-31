const SCRIPT_PATHS = ['../js/message.js', '../js/connect.js']
// 在content_script中无法设置type=module，导致无法引入带有import的语法
const injectScript = () => {
  const BODY = document.querySelector('body')
  SCRIPT_PATHS.forEach(path => {
    let scriptTag = document.createElement('script')

    scriptTag.setAttribute('src', path)
    scriptTag.setAttribute('type', 'module')
    BODY.appendChild(scriptTag)
    scriptTag = null
  })
}

window.onload = function () {
  injectScript()
}