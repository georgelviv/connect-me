const fs = require('fs');
const { dedent } = require('helpers');
const WPA_SUPPLICANT_PATH = '/etc/wpa_supplicant/wpa_supplicant.conf';
const DEFAULT_ENCODING = 'utf8';

const setNetworksConfiguration = (configs) => {
  return new Promise((resolve, reject) => {
    fs.readFile(WPA_SUPPLICANT_PATH, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const configurations = data.toString()
        .replace(/network={[\s\S]+}/gm, '').trim();

      const networks = configs.map((network) => {
        const { ssid, hasPsk, psk } = network;
        return hasPsk
          ? dedent`
            network={
              ssid="${ ssid }"
              psk="${ psk }"
            }
          ` : dedent`
            network={
              ssid="${ ssid }",
              key_mgmt=NONE
            }          
          `;
      }).join('');

      const wpaSupplicantContent = `${ configurations }\n${ networks }`;
      
    
      fs.writeFile(
        WPA_SUPPLICANT_PATH,
        wpaSupplicantContent,
        DEFAULT_ENCODING,
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
      });  
    });
  });
};

module.exports = setNetworksConfiguration;