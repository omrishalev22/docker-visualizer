module.exports = {
    onError: function (err) {
        console.log(err);
    },
    onSuccess: () => {
        console.log('Successful operation');
    },
    info: (msg) => {
        console.log(msg);
    }
};
