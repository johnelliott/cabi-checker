const fs = require('fs')
const debug = require('debug')('cabi')
const fetch = require('isomorphic-fetch')
const geolib = require('geolib')
const userhome = require('userhome')

const cabirc = fs.readFileSync(userhome('.cabirc'), 'utf8').split('\n')[0]
console.log(`Read config ${cabirc}`)
const split = cabirc.split('  ')
const loc = {
	latitude: split[0],
	longitude: split[1]
}
debug(loc)

// URLs https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json
const stationInfoURL = 'http://gbfs.capitalbikeshare.com/gbfs/en/station_information.json'
const stationStatusURL = 'http://gbfs.capitalbikeshare.com/gbfs/en/station_status.json'

console.log('Getting station locations...')
fetch(stationInfoURL)
.then(res => res.json())
.then(json => {
  const localStations = json.data.stations
    .filter(e => geolib.getDistance(loc, {latitude: e.lat, longitude: e.lon}) <= 400)
  debug('localStations', localStations)

  // Second json fetch is simply nested
  console.log('Getting dock status...')
  fetch(stationStatusURL)
    .then(res => res.json())
    .then(json => {
      const localStationsInfo = json.data.stations
        .filter(e => localStations
          .map(s => s.station_id)
          .includes(e.station_id))
        debug('localStationsInfo', localStationsInfo)

      localStationsInfo.forEach(e => {
        const name = localStations[localStations.map(s => s.station_id).indexOf(e.station_id)].name
        const bikes = parseInt(e.num_bikes_available)
        const docks = parseInt(e.num_docks_available)
        // TODO get the name to show up
        console.log(`${name}: ${bikes}/${docks} ${createEmojiDockString(bikes, docks)}`)
      })
    })
})

function createEmojiDockString (bikes, docks) {
  return Array(bikes+1).join("🚴 ").concat(Array(docks+1).join('⎍ '))
}
