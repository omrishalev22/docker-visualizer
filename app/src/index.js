const generator = require('./common/visualizer-generator/generator');
const logger = require('./common/logger/logger');

logger.info('Starting to create your visualized Docker-compose file...');
generator.yaml2puml(()=>{
    logger.info('Completed');
});



