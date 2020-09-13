import Benchmark from 'benchmark'
import assert from 'assert'
import {
  createArr,
  isNotNullPredicate,
  mapNotNullReduceOp,
  someCalculation,
  someTransform,
  sumByReduceOp,
  sumReduceOp,
} from './perf-impl/common.mjs'
import R from 'ramda'

const arrSize = parseInt(process.env.ARR_SIZE)

const setOperationSuite = new Benchmark.Suite('Ramda Operation')

function v1Standard(arr) {
  return R.pipe(
    R.map(someTransform),
    R.filter(isNotNullPredicate),
    R.uniq,
    R.map(someCalculation),
    R.sum,
  )(arr)
}

function v2(arr) {
  return R.pipe(
    R.reduce(mapNotNullReduceOp(someTransform), []),
    R.uniq,
    R.reduce(sumByReduceOp(someCalculation), 0),
  )(arr)
}

function v2Transduce(arr) {
  return R.pipe(
    R.reduce(mapNotNullReduceOp(someTransform), []),
    R.uniq,
    R.transduce(R.map(someCalculation), sumReduceOp, 0),
  )(arr)
}

const arr = createArr(arrSize)
const ans = v1Standard(arr)
assert.strictEqual(v2(arr), ans)
assert.strictEqual(v2Transduce(arr), ans)

setOperationSuite
  .add('version 1, use map', function () {
    v1Standard(arr)
  })
  .add('version 2, group to reduce for mapNotNull', function () {
    v2(arr)
  })
  .add(
    'version 2, group to reduce for mapNotNull, use transduce for sum',
    function () {
      v2Transduce(arr)
    },
  )
  // add listeners
  .on('start', function () {
    console.log(`${this.name} ARR_SIZE=${arrSize}`)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
