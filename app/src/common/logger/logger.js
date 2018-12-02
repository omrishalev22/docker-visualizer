var colors = require('colors');

module.exports = {
    error: function (err) {
        console.log(err.red);
    },
    success: (msg) => {
        console.log((msg).bold.bgGreen);
    },
    info: (msg) => {
        console.log(msg.italic);
    },
    warn: (msg) => {
        console.warn((msg).yellow);
    }
};
