export const ExtensionType = { // 暂时排除与devtools的通信
  INJECT: 'INJECT',
  CONTENT: 'CONTENT',
  POPUP: 'POPUP',
  BACKGROUND: 'BACKGROUND',
  DEVTOOL: 'DEVTOOL',
  OPTION: 'OPTION'
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
export class Message {
  /**
   * 构造消息发送类，传入发送点和接受点
   * @param {ExtensionType} from
   * @param {ExtensionType} to
   * @param {Window} context
   */
  constructor(from, to, context) {
    this.local = from
    this.origin = to
    this.context = context
    this.send = this.findMethod('send')
    // this.receive = this.findMethod('receive')
  }

  /**
   * 从字典中找到对应的发送消息方法或者接受消息方法
   * @param {'send' | 'receive'} key
   * @returns {Function}
   */
  findMethod(key) {
    const dict = MessageDict.find(item => {
      return item.local === this.local && item.origin === this.origin
    })
    if (!dict) {
      if (this.origin === ExtensionType.BACKGROUND)
        throw new Error(`can't send message from '${this.local}' to '${this.origin}',
        you can use 'chrome.extension.getBackgroundPage' to get '${this.origin}' window`)
      else throw new Error(`can't send message from '${this.local}' to '${this.origin}',
        you can use 'chrome.extension.getViews' to get '${this.origin}' window`)
    }
    return dict[key]
  }

  /**
   * 发送消息
   * @param {String} type
   * @param {Object} data
   * @param {Function} callback
   */
  sendMessage(type, data, callback) {
    // option --> background
    if (this.from === ExtensionType.OPTION) {
      this.context.vueApp.setState('')
      return
    }

    const PB = ['POPUP', 'BACKGROUND']
    const IC = ['INJECT', 'CONTENT']
    const message = {type, data, timestamp: this.getTimestamp()}
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
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
      let response = null
      sender.origin = this.origin

      if (request.type === type && callback) {
        response = await callback.call(this, request, sender)
      }

      sendResponse({
        data: response,
        state: true
      })
    })
  }

  getTimestamp () {
    return new Date().getTime()
  }
}

window.Message = Message