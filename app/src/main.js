const generator = require('./common/visualizer-generator/generator');
const logger = require('./common/logger/logger');

module.exports = {
    visualize: function (file,isUserSpecificOutput) {
        logger.info('Starting to create your visualized docker-compose file...');
        generator.visualize(file,isUserSpecificOutput);
    }
}