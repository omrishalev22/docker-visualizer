const generator = require('./common/visualizer-generator/generator');
const logger = require('./common/logger/logger');

module.exports = {
    yaml2puml: function f(isUserSpecificOutput) {
        logger.info('Starting to create your visualized Docker-compose file...');
        generator.yaml2puml(isUserSpecificOutput,()=>{
            logger.info('Completed');
        });
    }
}