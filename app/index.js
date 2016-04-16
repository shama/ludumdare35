var yo = require('yo-yo')
var ndarray = require('ndarray')
var raf = require('raf')

var shape = [100, 100]
var tiles = ndarray(new Int8Array(shape[0] * shape[1]), shape)

var testShapes = [
  // Gosper glider gun
  [1, 5],[1, 6],[2, 5],[2, 6],[11, 5],[11, 6],[11, 7],[12, 4],[12, 8],[13, 3],[13, 9],[14, 3],[14, 9],[15, 6],[16, 4],[16, 8],[17, 5],[17, 6],[17, 7],[18, 6],[21, 3],[21, 4],[21, 5],[22, 3],[22, 4],[22, 5],[23, 2],[23, 6],[25, 1],[25, 2],[25, 6],[25, 7],[35, 3],[35, 4],[36, 3],[36, 4],
  // Random cells
  [60, 47],[61,47],[62,47],
  [60, 48],[61,48],[62,48],
  [60, 49],[61,49],[62,49],
  [60, 51],[61,51],[62,51],
]
testShapes.forEach(function(n) {
  tiles.set(n[0], n[1], 1)
})

module.exports = function () {
  var b = board()

  raf(function loop () {
    setTimeout(function () {
      tick()
      raf(loop)
    }, 1000)
  })

  return yo`<svg viewBox="0 0 1000 1000">
    ${b}
  </svg>`

  function tick () {
    for (var i = 0; i < shape[0]; i++) {
      for (var j = 0; j < shape[1]; j++) {
        var alive = 0
        var count = neighbors(i, j)
        var cell = tiles.get(i, j)
        if (cell > 0) {
          alive = count === 2 || count === 3 ? 1 : 0
        } else {
          alive = count === 3 ? 1 : 0
        }
        tiles.set(i, j, alive)
      }
    }
    yo.update(b, board())
  }

  function neighbors (x, y) {
    var amount = 0
    function isFilled (x, y) {
      return tiles.get(x, y)
    }
    if (isFilled(x-1, y-1)) amount++
    if (isFilled(x,   y-1)) amount++
    if (isFilled(x+1, y-1)) amount++
    if (isFilled(x-1, y  )) amount++
    if (isFilled(x+1, y  )) amount++
    if (isFilled(x-1, y+1)) amount++
    if (isFilled(x,   y+1)) amount++
    if (isFilled(x+1, y+1)) amount++
    return amount
  }
}

function board () {
  console.time('board')
  var el = yo`<g></g>`
  var size = 10
  for (var i = 0; i < shape[0]; i++) {
    for (var j = 0; j < shape[1]; j++) {
      var n = tiles.get(i, j)
      if (n) {
        el.appendChild(yo`<rect x="${i * size}" y="${j * size}" width="${size}" height="${size}" />`)
      }
    }
  }
  console.timeEnd('board')
  return el
}
