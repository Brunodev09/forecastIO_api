const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for. Include street and city. Country is optional',
            string: true //parse it as a string
        }
    })
    .help()
    .alias('help','h')
    .argv;


let encodedAddress = encodeURIComponent(argv.a);
let geocodeURL = `http://www.mapquestapi.com/geocoding/v1/address?key=2cPAxTCB0oBuMXgF71sO0qGAujCSXD6q&location=${encodedAddress}`;

axios.get(geocodeURL).then((response) => {
    let lat = response.data.results[0].locations[0].latLng.lat;
    let lng = response.data.results[0].locations[0].latLng.lng;
    let tempURL = `https://api.forecast.io/forecast/4a04d1c42fd9d32c97a2c291a32d5e2d/${lat},${lng}`;

    return axios.get(tempURL, {params: {units: 'si'}});
}).then((response) => {
    let temperature = response.data.currently.temperature;
    let appTemperature = response.data.currently.apparentTemperature;
    console.log(`The temperature is ${temperature}C and the apparent temperature is ${appTemperature}C`);
}).catch((e) => {
    if (e.code === 'ENOTFOUND') console.log('Cannot connect to servers.');
    else console.log(e);
});

// Geo Key --> 2cPAxTCB0oBuMXgF71sO0qGAujCSXD6q
// Forecast Key --> fba5d797c01327264ab8b28b540883f5
// https://api.darksky.net/forecast/[key]/[latitude],[longitude]