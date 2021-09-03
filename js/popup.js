import { Message } from './message.js'

const initVue = () => {
  return new Vue({
    el: '#popup',
    name: 'POPUP',
    data () {
      return {
        title: 'v-capture',
        isWork: true,
      }
    },
  })
}

window.vueApp = initVue()