
const initVue = () => {
  return new Vue({
    el: '#background',
    name: 'BACKGROUND',
    data: {
      message: 'background.html'
    },
    created () {
    },
    destroyed () {
    },
  })
}

window.vueApp = initVue()