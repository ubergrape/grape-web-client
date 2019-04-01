import Random from 'random-js'

class Backoff {
  constructor(options) {
    const opts = options || {}
    this.opts = opts
    this.random = new Random(Random.engines.mt19937().autoSeed())
    this.ms = opts.min || 100
    this.max = opts.max || 10000
    this.factor = opts.factor || 2
    this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0
  }

  duration() {
    let { ms } = this
    if (this.jitter) {
      const rand = parseInt(this.random.real(1, 10), 10)
      ms *= rand
    }
    this.ms = this.ms * this.factor
    if (this.ms >= this.max) this.ms = this.opts.min || 100
    return Math.min(ms, this.max)
  }

  reset() {
    this.ms = this.opts.min || 100
  }
}

export default Backoff
