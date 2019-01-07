const { scan, getNetworksConfiguration } = require('wifi');

// scan()
//   .then(console.log)

getNetworksConfiguration()
  .then((res) => {
    console.log(res);
  });