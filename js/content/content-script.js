/**
 * 由于无法使用import引入message.js文件，所以这里暂时重新写了个简单的版本
 */
class Message {
  onMessage(type, callback) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      sender.origin = this.origin

      if (request.type === type && callback && typeof callback === 'function') {
        callback(request, sender)
      }

      sendResponse(true)
    })
  }
  sendMessage (type, data, callback) {
    const message = {
      type,
      data,
      timestamp: new Date().getTime()
    }

    chrome.runtime.sendMessage(message, callback)
  }
}

const changeVideoFn = (state) => {

}

const changeNetworkFn = (state) => {

}

const getCsrfToken = () => {
  return new Promise((resolve, reject) => {
    const items = document.cookie.split(';')
    const temp = items.find(item => {
      return item.split('=')[0] === 'csrfToken'
    })

    resolve(temp.split('=')[1])
  })
}

const changeHtmlPropsFn = (state) => {
  if (!state) return

  console.log(document.cookie)
}

const C2BMessage = new Message('CONTENT', 'BACKGROUND')

C2BMessage.sendMessage('view', {}, (response) => {
  if (!response.state) return

  const {videoMonitorOpen, networkProxyOpen, propsInjectOpen} = response.data
  changeNetworkFn(networkProxyOpen)
  changeVideoFn(videoMonitorOpen)
  changeHtmlPropsFn(propsInjectOpen)
})

C2BMessage.onMessage('beforeRequest', (request) => {
  if (request.data.type !== 'xmlhttprequest') return
  console.log('beforeRequest >>>', request)
})

C2BMessage.onMessage('responseStarted', (response) => {
  if (response.data.type !== 'xmlhttprequest') return
  console.log('responseStarted >>>', response)
})

C2BMessage.onMessage('beforeSendHeaders', response => {
  if (response.data.type !== 'xmlhttprequest') return
  console.log('beforeSendHeaders >>>', response)
})
