import { sample as arr } from '../data'

arr.filter(a => a.money !== null).map(it => it.money * 2).reduce((sth, b) => sth + b, 0)
console.log(arr.filter(a => a.money !== null).map(it => it.money * 2).reduce((sth, b) => sth + b, 0))