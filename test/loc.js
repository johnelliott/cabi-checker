var test = require('tape')
var fs = require('fs')

const sample = JSON.parse(fs.readFileSync('./sample.json'))
var addDistance = require('../loc.js').addDistance
var here = { latitude: '38° 54\' 17" N', longitude: '77° 1\' 30" W' }

test('loc', function(t) {
	t.plan(2)

	t.equal(typeof addDistance, 'function', 'loc exports function')
	t.true(addDistance(here, sample.data.stations) instanceof Array, 'returns an Array')
})

