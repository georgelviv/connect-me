const { scan, getNetworksConfiguration, setNetworksConfiguration } = require('wifi');

const configs = [
  { ssid: 'Google.comV2', hasPsk: true, psk: 'AJT11may1962ajt' }
];

// scan()
//   .then(console.log)

setNetworksConfiguration(configs)
  .then((res) => {
    console.log('Updated');
  });