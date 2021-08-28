const EventDict = { // 暂时排除与devtools的通信
  INJECT: 'INJECT',
  CONTENT: 'CONTENT',
  POPUP: 'POPUP',
  BACKGROUND: 'BACKGROUND',
  DEVTOOL: 'DEVTOOL'
}

const EventTo = { // 用于验证哪些文件组件之间可以相互通信
  INJECT: [EventDict.CONTENT],
  CONTENT: [EventDict.INJECT, EventDict.POPUP, EventDict.BACKGROUND],
  POPUP: [EventDict.CONTENT, EventDict.BACKGROUND],
  BACKGROUND: [EventDict.CONTENT, EventDict.POPUP]
}

const EmitterFnDict = {
  INJECT: {
    fns: [
      {
        to: EventDict.CONTENT,
        fn: window.postMessage
      }
    ]
  },
  CONTENT: {
    fns: [
      {
        to: EventDict.INJECT,
        fn: window.postMessage
      },
      {
        to: EventDict.POPUP,
        fn: chrome.runtime.sendMessage
      },
      {
        to: EventDict.BACKGROUND,
        fn: chrome.runtime.sendMessage
      }
    ]
  },
  POPUP: {
    fns: [
      {
        to: EventDict.CONTENT,
        fn: chrome.tabs.sendMessage
      }
    ]
  },
  BACKGROUND: {
    fns: [
      {
        to: EventDict.CONTENT,
        fn: chrome.tabs.sendMessage
      }
    ]
  }
}

export default class EventManager {
  static instance = null

  constructor() { // private
    this._events = {}
    this._id = 0
  }

  static getInstance() {
    if (!EventManager.instance) EventManager.instance = new EventManager()

    return EventManager.instance
  }

  /**
   * 发送事件通信
   * @param from {EventDict}
   * @param to {EventDict}
   * @param data {Object}
   */
  register(from, to, data = {}) {
    if (!this.registerValidate(from, to)) {
      return new TypeError(`event '${from}' can't send to '${to}'`)
    }

    const event = new Event(this._id, from, to, data)

    this._events[this._id] = event
    this._id++

    return event
  }

  /**
   * 是否允许发送通信
   * @param from
   * @param to
   * @return {Boolean}
   */
  registerValidate (from, to) {
    return EventTo[from].indexOf(EventDict[to]) !== -1
  }

  /**
   * 通过 EventManager 的emit方法为触发所有在EventManager注册过的事件
   */
  emit () {
    const events = Object.values(this._events)

    events.forEach(e => {
      e.send(e.data)
    })
  }

  on () {

  }

  remove (id) {
    delete this._events[id]

    return this._events
  }

  destroy () {
    EventManager.instance = null
  }

  clear () {
    this._events = []

    return this._events
  }

}

class Event {
  /**
   * @param id {Number}
   * @param from {EventDict}
   * @param to  {EventDict}
   * @param data {Object}
   */
  constructor(id, from, to, data) {
    this.id = id
    this.from = EventDict[from]
    this.to = EventDict[to]
    this.data = data
    this.send = EmitterFnDict[from].fns.find(item => item.to === to).fn
  }

  /**
   * Event实例的 dispatch 方法只触发单个事件
   * @param callback {Function | undefined}
   */
  dispatch (callback) {
    return new Promise(resolve => {
      if (callback && typeof callback === 'function') resolve(callback(this))
      resolve()
    })
    .then((res) => {
      if (res) {
        return this.send(res)
      } else {
        return this.send()
      }
    })

  }
}