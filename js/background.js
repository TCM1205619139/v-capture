window.onload = () => {
    initVue()
}

const initVue = () => {
    const vue = new Vue({
        el: '#app',
        data: {
            message: 'background.html'
        }
    })
    console.log(vue);
}