const fs = require('fs')
const debug = require('debug')('cabi')
const fetch = require('node-fetch')
const geolib = require('geolib')
const userhome = require('userhome')

const cabirc = fs.readFileSync(userhome('.cabirc'), 'utf8').split('\n')
debug(`Read config ${cabirc}`)
const [locationString, stationInfoURL, stationStatusURL] = cabirc
const split = locationString.split('  ')
const loc = {
  latitude: split[0],
  longitude: split[1]
}
debug(loc)

debug('Getting station info...')
fetch(stationInfoURL)
  .then(res => {
    if (!res.ok) {
      return new Error('fetch issue')
    }
    return res
  })
  .then(res => res.json())
  .then(json => {
    json.data.stations.forEach(e => {
      e.away = geolib.getDistance(loc, {latitude: e.lat, longitude: e.lon})
    })
    const localStations = json.data.stations
      .filter(e => e.away <= 2000)
    debug('localStations', localStations.map(s => s.away))

    // Second json fetch is simply nested
    debug('Getting dock status...')
    fetch(stationStatusURL)
      .then(res => {
        if (!res.ok) {
          return new Error('fetch issue')
        }
        return res
      })
      .then(res => res.json())
      .then(json => {
        const localStationsInfo = json.data.stations
          .filter(e => localStations
            .map(s => s.station_id)
            .includes(e.station_id))
        debug('localStationsInfo', localStationsInfo)

        localStationsInfo
          .sort((a, b) => {
            const stationAInfo = localStations[localStations.map(s => s.station_id).indexOf(a.station_id)]
            const stationBInfo = localStations[localStations.map(s => s.station_id).indexOf(b.station_id)]
            return stationAInfo.away - stationBInfo.away
          })
          .slice(0, 5)
          .forEach(e => {
            const stationInfo = localStations[localStations.map(s => s.station_id).indexOf(e.station_id)]
            const bikes = parseInt(e.num_bikes_available)
            const docks = parseInt(e.num_docks_available)
            console.log(`${bikes} bikes ${docks} docks ${stationInfo.name} (${stationInfo.away}m)`)

            const ebikes = parseInt(e.num_ebikes_available)
            if (ebikes > 0) {
              console.log(`⚡️ ebikes: ${stationInfo.name} has ${ebikes} ⚡️`)
            }
          })
      })
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
