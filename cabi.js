const fs = require('fs')
const url = require('url')

const debug = require('debug')('cabi')
const fetch = require('isomorphic-fetch')
const geolib = require('geolib')
const userhome = require('userhome')

const addDistance = require('./loc.js').addDistance
const sortByDistance = require('./loc.js').sortByDistance
const filterStationName = require('./loc.js').filterStationName

const cabirc = fs.readFileSync(userhome('.cabirc'), 'utf8').split('\n')[0]
console.log(`Read config ${cabirc}`)
const split = cabirc.split('  ')
const loc = {
	latitude: split[0],
	longitude: split[1]
}
debug(loc)


// set up Urls
// https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json
const config = {
  protocol: 'https:',
  headers:{}
}
const stationInfoURL = url.format({
  hostname: 'gbfs.capitalbikeshare.com',
  pathname: 'gbfs/en/station_information.json',
  query: {}
})
debug('stationInfoURL', stationInfoURL)
const stationStatusURL = url.format({
	hostname: 'gbfs.capitalbikeshare.com',
	pathname: 'gbfs/en/station_status.json',
	query: {}
})
debug('stationStatusURL', stationStatusURL)

// use some state as a target for merging json
const batch = {}

console.log('Getting station info...')
fetch(stationInfoURL, config)
.then((res)=>res.json())
.then((json)=>{
	const closestIds = sortByDistance(addDistance(loc, json.data.stations).filter((e)=>{
		return e.distance <= 400
	}))
	.map((e)=>{
		batch[e.station_id] = e
		return e.station_id
	})

	// Second json fetch is simply nested
	console.log('Getting dock info...')
	fetch(stationStatusURL, config)
	.then(res => res.json())
	.then(json => {
		const myStation = json.data.stations.filter(e => closestIds.includes(e.station_id))
		myStation.forEach(e => {
			const batchfoo = Object.assign({}, batch[e.station_id], e)
			batch[e.station_id] = batchfoo
			const bikes = parseInt(batch[e.station_id].num_bikes_available)
			const docks = parseInt(batch[e.station_id].num_docks_available)
			debug(batch[e.station_id].name, 'bikes:', bikes, 'docks:', docks, bikes + render(bikes, docks) + docks)
			console.log(`${batch[e.station_id].name}: ${bikes}/${docks} ${render(bikes, docks)}`)
		})
	})
})

function render (bikes, docks) {
  return Array(bikes+1).join("🚴 ").concat(Array(docks+1).join('⎍ '))
}
