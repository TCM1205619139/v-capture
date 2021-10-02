import { Message, ExtensionType } from './message.js'

const initVue = () => {
  return new Vue({
    el: '#popup',
    name: 'POPUP',
    data () {
      return {
        title: 'v-capture',
        isWork: true,
        P2CMessage: null
      }
    },
    created () {
      this.createP2CMessage()
    },
    methods: {
      createP2CMessage () {
        this.P2CMessage = new Message(ExtensionType.POPUP, ExtensionType.CONTENT)

        this.P2CMessage.sendMessage('fill-emial-content')
      },
    }
  })
}

window.vueApp = initVue()
