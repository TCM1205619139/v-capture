export default class Request {
  constructor() {
  }

  static Type = {
    onBeforeRedirect: 'extraHeaders',
    onAuthRequired: 'blocking',
    onBeforeRequest: 'requestBody',
    onBeforeSendHeaders: 'requestHeaders',
    onCompleted: 'responseHeaders',
    onErrorOccurred: 'extraHeaders',
    onHeadersReceived: 'blocking',
    onResponseStarted: 'responseHeaders',
    onSendHeaders: 'extraHeaders',
  }

  /**
   * 包装原生 chrome 插件的网络监听方法
   * @param {
   *   'onBeforeRedirect'
   *   | 'onAuthRequired'
   *   | 'onBeforeRequest'
   *   | 'onBeforeSendHeaders'
   *   | 'onCompleted'
   *   | 'onErrorOccurred'
   *   | 'onHeadersReceived'
   *   | 'onResponseStarted'
   *   | 'onSendHeaders'
   * } type
   * @param {Function} callback
   */
  on(type, callback, ...args) {
    if (!(type in Request.Type)) throw new TypeError(`invalid type: '${type}' in 'Request.on'`)

    chrome.webRequest[type].addListener(
      async details => {
        if (typeof callback === 'function') await callback(details)
      },
      args[0] || {urls: ["<all_urls>"]},
      args[1] || [Request.Type[type]])
  }
}