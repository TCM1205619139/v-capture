import EventManager from './EventManager.js'

const initVue = () => {
  return new Vue({
    el: '#popup',
    name: 'POPUP',
    data: {
      message: 'v-capture',
      isWork: true,
    },
    created () {
      this.eventManager = EventManager.getInstance()
      this.BACKGROUND = this.eventManager.register('POPUP', 'BACKGROUND')
    },
    destroyed () {
      this.eventManager = null
    },
    methods: {
      networkProxy () {
        this.BACKGROUND.dispatch(e => {
          console.log(e)
        })
      }
    }
  })
}

window.vueApp = initVue()