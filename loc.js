var geolib = require('geolib')
var debug = require('debug')('cabi:loc')

const home = '38° 54\' 17" N  77° 1\' 30" W'
const split = home.split('  ')
const loc = {
	latitude: split[0],
	longitude: split[1]
}
debug(loc)

//// This is rally alll about stations

function addDistance(here = loc, stations) {
  var result = stations.map((e)=>{
    const there = { latitude: e.lat, longitude: e.lon }
    const distance = geolib.getDistance(here, there)
    return Object.assign({}, e, { distance })
  })
  debug(result[0])
  return result
}

function filterStationName(word, stations) {
	return stations.filter((s,i,arr)=>{
		return s.name.match(word)
	})
}

function sortByDistance(stations) {
  return stations.sort(numeric)
}

function numeric(a, b) {
  if (a.distance > b.distance) {
    return 1;
  }
  if (a.distance < b.distance) {
    return -1;
  }
  // a must be equal to b
  return 0;
}

exports.addDistance = addDistance
exports.sortByDistance = sortByDistance
exports.filterStationName = filterStationName
