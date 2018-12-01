var colors = require('colors');

module.exports = {
    error: function (err) {
        console.log(err);
    },
    success: (msg) => {
        console.log(colors.green(msg));
    },
    info: (msg) => {
        console.log(msg);
    },
    warn: (msg) => {
        console.warn(msg);
    }
};
