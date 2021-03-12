const START_TIME = Symbol("start_time");
const HANDLER = Symbol("handler");

const PAUSE_START = Symbol("pause_start");
const PAUSE_TIME = Symbol("pause_time");


export class Timeline {
  constructor() {
    this.animations = new Set();
    this.animationTimes = new Map();
    this[PAUSE_TIME] = 0;

    this.tick = () => {
      let now = Date.now();

      for (let animation of this.animations) {
        let time = this.animationTimes.get(animation);
        let t;
        if (time < this[START_TIME]) {
          t = now - this[START_TIME];
        } else {
          t = now - time;
        }
        t = t - this[PAUSE_TIME];

        if (t > animation.duration) {
          animation.receiveTime(animation.duration);
          this.animations.delete(animation);
          continue;
        } else {
          animation.receiveTime(t);
        }
      }
      this[HANDLER] = window.requestAnimationFrame(this.tick);
    }
  }
  start() {
    this[START_TIME] = Date.now();
    this.tick();
  }
  pause() {
    this[PAUSE_START] = Date.now();
    window.cancelAnimationFrame(this[HANDLER])
  }
  resume() {
    this[PAUSE_TIME] = this[PAUSE_START] - this[START_TIME];
    this.tick();
  }
  add(animation, time) {
    this.animations.add(animation);
    this.animationTimes.set(animation, time || Date.now());
  }
  reset() {
    this.animations = new Set();
    this.animationTimes = new Map();
    this[PAUSE_TIME] = 0;

  }
}

export class Animation {
  constructor(obj, property, startValue, endValue, duration, delay, timingFunction, template) {
    this.obj = obj;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction || (v => v);
    this.template = template || (v => v);
  }

  receiveTime(t) {
    let range = this.endValue - this.startValue;
    let progress = this.timingFunction(t / this.duration); // [0, 1]

    this.obj[this.property] = this.template(this.startValue + range * progress);
  }
}