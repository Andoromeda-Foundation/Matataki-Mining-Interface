import store from 'store'

export default {
  get(key: string) {
    return store.get(key)
  },
  set(key: string, val: string) {
    store.set(key, val)
  },
  remove(key: string) {
    store.remove(key)
  },
  clearAll() {
    store.clearAll()
  },
  clear() {
    const whitelist = ['']
    store.each((value, key) => !whitelist.includes(key) && store.remove(key))
  }
}
