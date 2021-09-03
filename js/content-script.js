/**
 * 由于引入message.js文件有问题，所以这里暂时使用原生的方式进行监听
 */
class Message {
  // constructor(from, to, context) {
  //   this.local = from
  //   this.origin = to
  //   this.context = context
  //   // this.receive = this.findMethod('receive')
  // }
  onMessage(type, callback) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      sender.origin = this.origin

      if (request.type === type && callback) {
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

const changeVideoFn = (request, sender) => {

}

const changeNetworkFn = (request, sender) => {

}

const changeHtmlPropsFn = (data, sender) => {
  debugger
  console.log(data)
  console.log(sender)
  confirm('请输入')
}

const message = new Message('CONTENT', 'BACKGROUND')
message.sendMessage('view', {}, (response) => {
  if (!response.state) return

  const {videoMonitorOpen, networkProxyOpen, propsInjectOpen} = response.data
})


console.log(message)