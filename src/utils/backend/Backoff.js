import Random from 'random-js'

class Backoff {
  constructor(options) {
    const opts = options || {}
    this.random = new Random(Random.engines.mt19937().autoSeed())
    this.ms = opts.min || 100
    this.max = opts.max || 10000
    this.factor = opts.factor || 2
    this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0
  }

  duration() {
    let { ms } = this
    if (this.jitter) {
      const rand = this.random.real(1, 2)
      ms *= rand
    }
    this.ms = this.ms * this.factor
    return Math.min(ms, this.max)
  }
}

export default Backoff
