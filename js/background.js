import {Message, ExtensionType} from './message.js'

const initVue = () => {
  return new Vue({
    el: '#background',
    name: 'BACKGROUND',
    messageB2C: null,
    data: {
      message: 'background.html',
      optionPageData: {}, // 用于接收管理option页面发送的数据
      contentPageData: {}, // 用于接收管理content页面的部分数据
      popupPageData: {},  // 管理popup页面的部分数据
      injectPageData: {}, // 管理inject的部分数据
    },
    methods: {
      /**
       * @param {
       * 'optionPageData'
       * | 'contentPageData'
       * | 'popupPageData'
       * | 'injectPageData'
       * } propName
       * @param {Object} data
       */
      setValue (propName, data) {
        const legalDict = ['optionPageData', 'contentPageData', 'popupPageData', 'injectPageData']
        if (legalDict.indexOf(propName) === -1)
          throw new TypeError(`invalid type: '${propName}', only use ${legalDict.join(',')}`)

        this[propName] = Object.assign(this[propName], data)
        localStorage.setItem(propName, JSON.stringify(this[propName]))
      },
      getValue (key) {
        return JSON.parse(localStorage.getItem(key))
      }
    },
    created () {
      this.optionPageData = this.getValue('optionPageData') || {}
      this.contentPageData = this.getValue('contentPageData') || {}
      this.popupPageData = this.getValue('popupPageData') || {}
      this.injectPageData = this.getValue('injectPageData') || {}
      this.messageB2C = new Message(ExtensionType.BACKGROUND, ExtensionType.CONTENT)
      this.messageB2C.sendMessage('open-inject', (request, sender) => {
        console.log(request, sender)
      })
      this.messageB2C.onMessage('view', (request, sender) => {
        // 使用箭头函数 this 为Vue实例，使用function为 Message 实例
        return {
          ...this.optionPageData
        }
      })
    },
    destroyed () {
    }
  })
}

window.vueApp = initVue()