const fs = require('fs');
const WPA_SUPPLICANT_PATH = '/etc/wpa_supplicant/wpa_supplicant.conf';

const getNetworksConfiguration = () => {
  const networkRegEx = /(network={)([\S\s]+)(})/mi;

  return new Promise((resolve, reject) => {
    fs.readFile(WPA_SUPPLICANT_PATH, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const str = data.toString();
      const match = str.match(networkRegEx)[0];
      if (match) {
        const networks = match.split(/network={/mi)
          .filter(Boolean)
          .map(str => {
            const strClean = str.replace(/[{}'"]/gi, '').trim();
            let network = {};

            strClean.split(/[\n ]/)
              .filter(Boolean)
              .forEach(line => {
                network = {
                  ...network,
                  ...getSSIDFromLine(line),
                  ...checkLineHasNoPsk(line),
                  ...checkPsk(line)
                }
              })

            
            return network;
          });
        
        resolve(networks);
      } else {
        resolve([]);
      }
    });
  });
};

function getSSIDFromLine(line) {
  const ssidRegEx = /(ssid=)(.+)/i;
  const match = line.match(ssidRegEx)
  if (match) {
    return {
      ssid: match[2]
    };
  } else {
    return {}
  }
}

function checkLineHasNoPsk(line) {
  const keyMGMTNone = /key_mgmt=NONE/i;
  if (line.match(keyMGMTNone)) {
    return {
      hasPsk: false
    }
  } else {
    return {};
  }
}

function checkPsk(line) {
  const pskRegEx = /(psk=)(.+)/i;
  const match = line.match(pskRegEx);
  if (match) {
    return {
      hasPsk: true,
      psk: match[2]
    }
  } else {
    return {}
  }
}

module.exports = getNetworksConfiguration;