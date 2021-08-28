import EventManager from './EventManager.js'

const initVue = () => {
  return new Vue({
    el: '#background',
    name: 'BACKGROUND',
    data: {
      message: 'background.html'
    },
    created () {
      this.eventManager = EventManager.getInstance()
      this.POPUP = this.eventManager.register('BACKGROUND', 'POPUP')
      console.log(this.POPUP)
    },
    destroyed () {
      this.eventManager = null
    },
  })
}

console.log(1)
window.vueApp = initVue()