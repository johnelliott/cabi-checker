const fs = require('fs')
const debug = require('debug')('cabi')
const fetch = require('node-fetch')
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
    const localStations = json.data.stations
    // .filter(e => geolib.getDistance(loc, {latitude: e.lat, longitude: e.lon}) <= 400)
    debug('localStations', localStations)

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

        localStationsInfo.forEach(e => {
          const name = localStations[localStations.map(s => s.station_id).indexOf(e.station_id)].name
          // const bikes = parseInt(e.num_bikes_available)
          // const docks = parseInt(e.num_docks_available)
          // console.log(`${name}: ${bikes}/${docks} ${createEmojiDockString(bikes, docks)}`)

          const ebikes = parseInt(e.num_ebikes_available)
          if (ebikes) {
            console.log(`⚡️  ${ebikes} ${name}`)
          }
        })
      })
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
