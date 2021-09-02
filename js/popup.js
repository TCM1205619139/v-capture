import {Message} from './message.js'

const initVue = () => {
  return new Vue({
    el: '#popup',
    name: 'POPUP',
    data: {
      title: 'v-capture',
      isWork: true,
      option: {},
      shiheng: {
        url: '11',
        account: '',
        password: ''
      }
    },
    created () {
      this.message = new Message('POPUP', 'CONTENT')
      this.backgroundPage = chrome.extension.getBackgroundPage()
      this.option = this.backgroundPage.vueApp.getValue('optionPageData')
    },
    destroyed () {
      setTimeout(() => {
        alert('')
        console.log(1)
      }, 500)
    },
    methods: {
      submit () {
        console.log(1)
      }
    }
  })
}

window.vueApp = initVue()