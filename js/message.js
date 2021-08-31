const ExtensionType = { // 暂时排除与devtools的通信
  INJECT: 'INJECT',
  CONTENT: 'CONTENT',
  POPUP: 'POPUP',
  BACKGROUND: 'BACKGROUND',
  DEVTOOL: 'DEVTOOL'
}

const MessageDict = [
  {
    local: ExtensionType.CONTENT,
    origin: ExtensionType.POPUP,
    send: chrome.runtime?.sendMessage,
  },
  {
    local: ExtensionType.CONTENT,
    origin: ExtensionType.BACKGROUND,
    send: chrome.runtime?.sendMessage
  },
  {
    local: ExtensionType.CONTENT,
    origin: ExtensionType.INJECT,
    send: window.postMessage
  },
  {
    local: ExtensionType.INJECT,
    origin: ExtensionType.POPUP,
    send: chrome.runtime?.sendMessage
  },
  {
    local: ExtensionType.INJECT,
    origin: ExtensionType.BACKGROUND,
    send: chrome.runtime?.sendMessage
  },
  {
    local: ExtensionType.INJECT,
    origin: ExtensionType.CONTENT,
    send: window.postMessage
  },
  {
    local: ExtensionType.POPUP,
    origin: ExtensionType.CONTENT,
    send: chrome.tabs?.sendMessage
  },
  {
    local: ExtensionType.POPUP,
    origin: ExtensionType.INJECT,
    send: chrome.tabs?.sendMessage
  },
  {
    local: ExtensionType.BACKGROUND,
    origin: ExtensionType.CONTENT,
    send: chrome.tabs?.sendMessage
  },
  {
    local: ExtensionType.BACKGROUND,
    origin: ExtensionType.INJECT,
    send: chrome.tabs?.sendMessage
  }
]

/**
 * Message为短链接，不进行事件缓存
 */
export default class Message {
  /**
   * 构造消息发送类，传入发送点和接受点
   * @param {ExtensionType} from
   * @param {ExtensionType} to
   */
  constructor(from, to) {
    this.local = from
    this.origin = to
    this.send = this.findMethod('send')
    // this.receive = this.findMethod('receive')
  }

  /**
   * 从字典中找到对应的发送消息方法或者接受消息方法
   * @param {'send' | 'receive'} key
   * @returns {Function}
   */
  findMethod(key) {
    return MessageDict.find(item => {
      return item.local === this.local && item.origin === this.origin
    })[key]
  }

  /**
   * 发送消息
   * @param {ExtensionType} type
   * @param {Object} data
   * @param {Function} callback
   */
  sendMessage(type, data, callback) {
    const PB = ['POPUP', 'BACKGROUND']
    const IC = ['INJECT', 'CONTENT']
    const message = {type, data}
    const options = {active: true, currentWindow: true}

    chrome.tabs.query(options, tabs => {
      /**
       * 三种发送消息方法的参数有一定区别，需要分别处理
       */
      if (PB.indexOf(this.local) !== -1 && IC.indexOf(this.origin) !== -1) {
        // chrome.tabs.sendMessage
        this.send(tabs[0].id, message, callback)
      } else if (IC.indexOf(this.local) !== -1 && PB.indexOf(this.origin) !== -1) {
        // chrome.runtime.sendMessage
        this.send(message, callback)
      } else {
        // window.postMessage
        this.send(message, this.local)
      }
    })
  }

  onMessage(type, callback) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      sender.origin = this.origin

      if (request.type === type && callback) {
        callback(request, sender)
      }

      sendResponse(true)
    })
  }
}

window.Message = Message