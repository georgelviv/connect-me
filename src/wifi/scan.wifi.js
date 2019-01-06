const { exec } = require('child_process');

const scan = () => {
  return new Promise((resolve, reject) => {
    console.log('Scanning...')
    exec('sudo iwlist wlan0 scan', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(parseIwlistStdout(stdout));
    });
  });
};

function parseIwlistStdout(stdout) {
  const cellRegEx = /Cell\s\d{1,3}/gm;

  const networksRaw = stdout.split(cellRegEx).slice(1);
  const networks = networksRaw.map(networkRaw => {
    const lines = networkRaw.split(/\n/);
    let network = {};
    
    lines.forEach(line => {
      line = line.trim();

      network = {
        ...network,
        ...checkAddress(line),
        ...checkSsid(line),
        ...checkChannel(line),
        ...checkFrequency(line),
        ...checkEncryption(line),
        ...checkQuality(line),
        ...checkSignalLevel(line)
      };

    });

    return network;
  });

  return networks;
}

function checkAddress(line) {
  const addressLineRegEx = /Address:/i;
  if (line.match(addressLineRegEx)) {
    return {
      address: line.split(addressLineRegEx)[1].trim()
    }
  } else {
    return {}
  }
}

function checkSsid(line) {
  const ssidLineRegEx = /ESSID:/i;
  const quotesRegEx = /\'|\"/g;

  if (line.match(ssidLineRegEx)) {
    return {
      ssid: line.split(ssidLineRegEx)[1]
        .replace(quotesRegEx, '').trim()
    }
  } else {
    return {}
  }
}

function checkChannel(line) {
  const channelLineRegEx = /Channel:/i;
  if (line.match(channelLineRegEx)) {
    return {
      channel: +line.split(channelLineRegEx)[1].trim()
    }
  } else {
    return {};
  }
}

function checkFrequency(line) {
  const frequencyRegEx = /(Frequency:)(\d+.?\d+ Ghz)/i;
  if (line.match(frequencyRegEx)) {
    return {
      frequency: line.match(frequencyRegEx)[2]
    };
  } else {
    return {}
  }
}

function checkEncryption(line) {
  const encryptionRegEx = /Encryption key:/i;
  if (line.match(encryptionRegEx)) {
    return {
      isEncrypted: line.split(encryptionRegEx)[1] === 'on'
    }
  } else {
    return {};
  }
}

function checkQuality(line) {
  const qualityRegEx = /(Quality=)(\d+\/\d+)/i;
  if (line.match(qualityRegEx)) {
    const quality = line.match(qualityRegEx)[2];
    const [quotient, divisor] = quality.split('/');
    return {
      quality: quotient / divisor
    }
  } else {
    return {};
  }
}

function checkSignalLevel(line) {
  const signalRegEx = /(Signal level=)(-?\d+ dBm)/i;
  if (line.match(signalRegEx)) {
    return {
      signal: line.match(signalRegEx)[2]
    }
  } else {
    return {};
  }
}

module.exports = scan;