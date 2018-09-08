# cabi cli
command line dock status for Capital Bikeshare or other GBFS bikeshare systems

# about
Check to see if there are bikes and docks near your computer without leaving the command line. 

This app does one thing. Much of it is nested and specific to GBFS and even DC. This app is a test case for future GBFS cache/sdk service for node.

# installation

`$ npm install -g cabi-checker`

# configuring .cabirc
This app uses a `.cabirc` file in the user home directory. The file contains the location from which to search.

Get your location however you'd like. I used the compass app on my phone and copied the text through the notes app. Edit `.cabirc` in your user home directory.
```
40° 45' 40" N  75° 0' 30" W
https://gbfs.citibikenyc.com/gbfs/en/station_information.json
https://gbfs.citibikenyc.com/gbfs/en/station_status.json
```
`$ cabi`

# sample output (different now, lazy)
```
Read config 38° 55' 57" N  77° 1' 42" W
Getting station info...
Getting dock info...
11th & Kenyon St NW: 0/27 ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ 
Park Rd & Holmead Pl NW: 8/10 🚴 🚴 🚴 🚴 🚴 🚴 🚴 🚴 ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ 
```

use with grep to get more specific
`$ cabi|grep Park`

```
Park Rd & Holmead Pl NW: 8/10 🚴 🚴 🚴 🚴 🚴 🚴 🚴 🚴 ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ ⎍ 
```

# compatability
Node v6 is required at the moment.
