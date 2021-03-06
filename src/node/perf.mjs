import Benchmark from 'benchmark'
import path from 'path'
import fs from 'fs'

import {
  arrayExtensionNativeFunctionalOperator,
  nativeFunctionalOperator,
  nativeFunctionalOperatorOpti,
  nativeReduceImperative,
} from './perf-impl/nativeFunctional.mjs'
import {
  arrayExtensionLodash,
  lazySeqLodashImpl,
  lodashFp,
  lodashFpOpti,
  lodashLazyChain,
  lodashLazyChainOpti,
  lodashOneByOne,
  lodashOneByOneOpti,
} from './perf-impl/lodashImpl.mjs'
import {
  arrayExtensionRamda,
  lazySeqRamdaImpl,
  ramdaPipe,
  ramdaPipeOpti,
} from './perf-impl/ramdaImpl.mjs'
import { arrayExtensionNative, lazySeqNativeImpl } from './perf-impl/native.mjs'
import { ideal, nativeStandard } from './perf-impl/ideal.mjs'
import { createArr } from './perf-impl/common.mjs'

// Assume the arrSize are in [1, 10, 100, 1000, 10000, 100000, 1000000]
const arrSize = parseInt(process.env.ARR_SIZE)
const benchmarkInitCount = parseInt(process.env.INIT_COUNT) || 1
const benchmarkMinSamples = parseInt(process.env.MIN_SAMPLE) || 10

if (!arrSize) {
  throw new Error('missing ARR_SIZE environment variable')
}

const arr = createArr(arrSize)

Benchmark.options.initCount = benchmarkInitCount
Benchmark.options.minSamples = benchmarkMinSamples

const suite = new Benchmark.Suite(
  `Standard Array Processing (size=${arrSize}, initCount=${benchmarkInitCount}, minSample=${benchmarkMinSamples})`,
)
// add tests
suite
  .add('native-ideal-while', function () {
    ideal(arr)
  })
  .add('native-standard-for-loop', function () {
    nativeStandard(arr)
  })
  .add('native-fp', function () {
    nativeFunctionalOperator(arr)
  })
  .add('native-fp-optimized', function () {
    nativeFunctionalOperatorOpti(arr)
  })
  .add('native-fp-reduce-imperative', function () {
    nativeReduceImperative(arr)
  })
  .add('lodash-one-by-one', function () {
    lodashOneByOne(arr)
  })
  .add('lodash-one-by-one-optimized', function () {
    lodashOneByOneOpti(arr)
  })
  .add('lodash-lazy-chain', function () {
    lodashLazyChain(arr)
  })
  .add('lodash-lazy-chain-optimized', function () {
    lodashLazyChainOpti(arr)
  })
  .add('lodash-fp', function () {
    lodashFp(arr)
  })
  .add('lodash-fp-optimized', function () {
    lodashFpOpti(arr)
  })
  .add('ramda', function () {
    ramdaPipe(arr)
  })
  .add('ramda-optimized', function () {
    ramdaPipeOpti(arr)
  })
  .add('array-ext-native', function () {
    arrayExtensionNative(arr)
  })
  .add('array-ext-native-fp-optimized', function () {
    arrayExtensionNativeFunctionalOperator(arr)
  })
  .add('array-ext-lodash-optimized', function () {
    arrayExtensionLodash(arr)
  })
  .add('array-ext-ramda-optimized', function () {
    arrayExtensionRamda(arr)
  })
  .add('lazy-sequence-native', function () {
    lazySeqNativeImpl(arr)
  })
  .add('lazy-sequence-lodash-optimized', function () {
    lazySeqLodashImpl(arr)
  })
  .add('lazy-sequence-ramda-optimized', function () {
    lazySeqRamdaImpl(arr)
  })
  // add listeners
  .on('start', function () {
    console.log(this.name)
  })
  .on('cycle', function (event) {
    const currentBench = event.target
    const benchName = currentBench.name

    console.log(String(currentBench))

    const outputDir = path.resolve('./benchmark')
    const resultPath = `${outputDir}/result.json`
    const result = JSON.parse(
      String(fs.readFileSync(resultPath, { encoding: 'utf-8' })),
    )

    const record = result.find((it) => it.benchmark === benchName) || {
      benchmark: null,
      results: [],
    }

    const filteredResults = record.results.filter((it) => it.size !== arrSize)

    const overwriteRecord = {
      ...record,
      results: [...filteredResults, { size: arrSize, hz: currentBench.hz }],
      benchmark: benchName,
    }

    const filtered = result.filter((it) => it.benchmark !== benchName)

    const overwriteResult = [...filtered, overwriteRecord].sort(
      (it) => it.benchmark,
    )

    fs.writeFileSync(resultPath, JSON.stringify(overwriteResult, null, 2))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  // run async
  .run({ async: false })
