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

const getCsrfToekn = () => {
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

const message = new Message('CONTENT', 'BACKGROUND')

message.sendMessage('view', {}, (response) => {
  if (!response.state) return

  const {videoMonitorOpen, networkProxyOpen, propsInjectOpen} = response.data
  changeNetworkFn(networkProxyOpen)
  changeVideoFn(videoMonitorOpen)
  changeHtmlPropsFn(propsInjectOpen)
})

message.onMessage('beforeRequest', (request) => {
  if (request.data.type !== 'xmlhttprequest') return
  console.log('beforeRequest >>>', request)
})

message.onMessage('responseStarted', (response) => {
  if (response.data.type !== 'xmlhttprequest') return
  console.log('responseStarted >>>', response)
})

message.onMessage('beforeSendHeaders', response => {
  if (response.data.type !== 'xmlhttprequest') return
  console.log('beforeSendHeaders >>>', response)
})
