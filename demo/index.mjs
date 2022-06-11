import { reactive, effect } from 'vue'

const state = reactive({
  a: 1,
  b: {
    c: 2,
  },
})

effect(() => {
  console.log('hello')
  console.log('a: ', state.a)
})

state.a = 2
setInterval(() => {
  state.a++
}, 1000)
