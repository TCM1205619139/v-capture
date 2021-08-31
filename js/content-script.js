/**
 * 由于引入message.js文件有问题，所以这里暂时使用原生的方式进行监听
 */
class Message {
  onMessage(type, callback) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      sender.origin = this.origin

      if (request.type === type && callback) {
        callback(request, sender)
      }

      sendResponse(true)
    })
  }
}

const changeVideoFn = (request, sender) => {

}

const changeNetworkFn = (request, sender) => {

}

const changePropsFn = (request, sender) => {

}
const message = new Message()
message.onMessage('video', changeVideoFn)
message.onMessage('network', changeNetworkFn)
message.onMessage('open-inject', changePropsFn)