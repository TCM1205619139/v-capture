import Message from './message.js'

const initVue = () => {
  return new Vue({
    el: '#popup',
    name: 'POPUP',
    data: {
      title: 'v-capture',
      isWork: true,
      networkProxyOpen: localStorage.getItem('networkProxyOpen') || false,
      videoMonitorOpen: localStorage.getItem('videoMonitorOpen') || false,
      propsInjectOpen: localStorage.getItem('propsInjectOpen') || false
    },
    created () {
      this.message = new Message('POPUP', 'CONTENT')
    },
    methods: {
      setState (type, state, propName) {
        // return function (state) {
          this[propName] = state
          this.message.sendMessage(type, {value: state})
          localStorage.setItem(propName, state)
        // }
      },
      openVideoMonitor (state) {
        this.setState('video', state, 'videoMonitorOpen')
      },
      openNetworkProxy (state) {
        this.setState('network', state, 'videoMonitorOpen')
      },
      openPropsInject (state) {
        this.setState('open-inject', state, 'propsInjectOpen')
      }
      // openNetworkProxy: this.setState('network', 'networkProxyOpen'),
      // openPropsInject: this.setState('open-inject', 'propsInjectOpen')
    }
  })
}

window.vueApp = initVue()