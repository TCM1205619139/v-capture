import Message from './message.js'

const initVue = () => {
  return new Vue({
    el: '#popup',
    name: 'POPUP',
    data: {
      title: 'v-capture',
      isWork: true,
      networkProxyOpen: false
    },
    created () {
      this.message = new Message('POPUP', 'CONTENT')
      this.message.sendMessage('message', {name: 'sweet'}, this.sendMessageFn)
    },
    methods: {
      networkProxy (state) {
        this.networkProxyOpen = state
      },
      sendMessageFn (...args) {
        console.log('sendMessageFn >>>', args)
      }
    }
  })
}

window.vueApp = initVue()