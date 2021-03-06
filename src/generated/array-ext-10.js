import { sample as arr } from '../data'

Array.prototype.ktMapNotNull = function (transform) {
  const result = []
  for (let i = 0, len = this.length; i < len; i++) {
    const e = transform(this[i])
    if (e !== null) {
      result.push(e)
    }
  }
  return result
}

Array.prototype.ktSum = function () {
  let sum = 0
  for (let i = 0, len = this.length; i < len; i++) {
    sum += this[i]
  }
  return sum
}

Array.prototype.ktMap = Array.prototype.map
  
arr.ktMapNotNull(it => it.money).ktMap(sth => sth * 2).ktSum()
arr.ktMapNotNull(it => it.money).ktMap(sth => sth * 2).ktSum()
arr.ktMapNotNull(it => it.money).ktMap(sth => sth * 2).ktSum()
arr.ktMapNotNull(it => it.money).ktMap(sth => sth * 2).ktSum()
arr.ktMapNotNull(it => it.money).ktMap(sth => sth * 2).ktSum()
arr.ktMapNotNull(it => it.money).ktMap(sth => sth * 2).ktSum()
arr.ktMapNotNull(it => it.money).ktMap(sth => sth * 2).ktSum()
arr.ktMapNotNull(it => it.money).ktMap(sth => sth * 2).ktSum()
arr.ktMapNotNull(it => it.money).ktMap(sth => sth * 2).ktSum()
arr.ktMapNotNull(it => it.money).ktMap(sth => sth * 2).ktSum()
console.log(arr.ktMapNotNull(it => it.money).ktMap(sth => sth * 2).ktSum())