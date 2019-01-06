const { scan } = require('wifi');

scan()
  .then((res) => {
    console.log(res);
  });