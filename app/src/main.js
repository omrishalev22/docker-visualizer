const generator = require('./common/visualizer-generator/generator');
const logger = require('./common/logger/logger');

module.exports = {
    visualize: function (file,output,customName,keepPumlFile) {
        logger.info('Starting to create your visualized docker-compose file...');
        return new Promise((resolve,reject)=>{
            generator.visualize(file,output,customName,keepPumlFile,(res)=>{
                if(res.resultCode !== 200){
                    reject('Oops Something went wrong please try again..')
                } else {
                    resolve(res);
                }

            })
        })
    }
}