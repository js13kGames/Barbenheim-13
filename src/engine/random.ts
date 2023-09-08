export class Random {
  constructor(private seed: number = 13 * 1024) {}
  next(max: number = 1) {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return (this.seed / 233280) * max;
  }
  inext(max: number = 1) {
    return this.next(max) | 0;
  }
}
