/**
 * 由于引入message.js文件有问题，所以这里暂时使用原生的方式进行监听
 */
class Message {
  onMessage(type, callback) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      sender.origin = this.origin

      if (request.type === type && callback) {
        // 不知道为什么一次message的发送会触发四次onMessage监听，虽然这里不影响
        callback(request.data, sender)
      }

      sendResponse(true)
    })
  }
}

const changeVideoFn = (request, sender) => {

}

const changeNetworkFn = (request, sender) => {

}

const changeHtmlPropsFn = (data, sender) => {
  console.log(data)
  console.log(sender)
  confirm('请输入')
}
const message = new Message()
message.onMessage('video', changeVideoFn)
message.onMessage('network', changeNetworkFn)
message.onMessage('open-inject', changeHtmlPropsFn)