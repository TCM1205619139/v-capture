import {Message, ExtensionType} from './message.js'

/**
 * option 页面只能通过background与其他页面进行通信，不能直接进行通信
 * @return {Vue}
 */
const initVue = () => {
  return new Vue({
    el: '#options',
    name: 'OPTIONS',
    data: {
      title: 'v-capture',
      networkProxyOpen: false,
      videoMonitorOpen: false,
      propsInjectOpen: false,
      backgroundPage: chrome.extension.getBackgroundPage()
    },
    created () {
      this.networkProxyOpen = this.getValue('networkProxyOpen') || false
      this.videoMonitorOpen = this.getValue('videoMonitorOpen') || false
      this.propsInjectOpen = this.getValue('propsInjectOpen') || false
    },
    methods: {
      setValue (key, value) {
        this[key] = value
        localStorage.setItem(key, JSON.stringify(value))
      },
      getValue (key) {
        return JSON.parse(localStorage.getItem(key))
      },
      /**
       * @param {ExtensionType} to
       */
      validSend (to) {
        const types = Object.values(ExtensionType)

        return new Promise((resolve, reject) => {
          if (types.indexOf(to) !== -1 && to === ExtensionType.BACKGROUND) {
            resolve()
          } else {
            reject()
          }
        })
      },
      openVideoMonitor (state) {
        this.setValue('videoMonitorOpen', state)
        this.validSend(ExtensionType.BACKGROUND)
          .then(() => {
            this.backgroundPage.vueApp.setValue('optionPageData', {videoMonitorOpen: state})
          })
      },
      openNetworkProxy (state) {
        this.setValue('networkProxyOpen', state)
        this.validSend(ExtensionType.BACKGROUND)
          .then(() => {
            this.backgroundPage.vueApp.setValue('optionPageData', {networkProxyOpen: state})
          })
        // this.setValue('network', state, 'videoMonitorOpen')
      },
      openPropsInject (state) {
        this.setValue('propsInjectOpen', state)
        this.validSend(ExtensionType.BACKGROUND)
          .then(() => {
            this.backgroundPage.vueApp.setValue('optionPageData', {propsInjectOpen: state})
          })
        // this.setValue('open-inject', state, 'propsInjectOpen')
      }
    }
  })
}

window.vueApp = initVue()