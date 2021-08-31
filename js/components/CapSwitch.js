export default {
  template: '' +
    '<div class="switch-component" @click="changeState">' +
    '<div :class="getStyle()"><div class="point" :class="getPointStyle()"></div></div>' +
    '</div>' +
    '',
  name: 'CapSwitch',
  props: {
    name: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
      default: 'small',
      validate (value) {
        return ['large', 'normal', 'small'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      selected: false
    }
  },
  methods: {
    changeState () {
      this.selected = !this.selected
      this.$emit('on-change', this.selected)
    },
    getStyle () {
      return [
        `switch-content-${this.size}`,
        this.selected ? 'selected' : ''
      ]
    },
    getPointStyle () {
      return this.selected ? 'point-right' : 'point-left'
    }
  }
}