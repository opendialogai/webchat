export default class Timer {
  constructor(duration, callback) {
    this.duration = duration
    this.callback = callback
    this.timer = null
  }

  reset() {
    clearTimeout(this.timer)
    this.start()
  }
  start() {
    this.timer = setTimeout(this.callback, this.duration)
  }
  stop() {
    clearTimeout(this.timer)
  }
}