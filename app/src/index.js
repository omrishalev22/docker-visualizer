#!/usr/bin/env node

const program = require('commander');
const main = require('./main');
const logger = require('./common/logger/logger');
const fs = require('fs');
const path = require('path');
const pjson = require('.././../package');

//if module was called from CLI else was required
if (require.main === module) {
    function dockerComposeLookup(cb) {
        fs.readdir(process.cwd(), (err, files) => {
            if (files.some(file => file === 'docker-compose.yml')) {
                cb(path.resolve(process.cwd(), 'docker-compose.yml'))
            } else {
                logger.info(`Couldn't find a docker-compose.yml file in this directory`);
                cb(false);
            }
        })
    }

    program
        .version(pjson.version, '-v, --version');

    program
        .command('build <outputPath>') // sub-command name, coffeeType = type, required
        .description('Build a visualization of docker-compose.yml, outputs a png file') // command description
        .option('-n, --name [value]', 'Name of output file [optional]', "")
        .option('-c, --custom [value]', 'Keep raw PUML file for graph customization [default = false]', false)
        .action(function (output, args) {
            dockerComposeLookup((file) => {
                if (!file) {
                    return;
                    process.exit(-1);
                }
                main.visualize(file, output, args.name, args.custom);
            })
        });

    program.parse(process.argv);
    program.args.length === 0 ? program.help() : ''; // console help in case no command was mentioned

} else {
    module.exports = require('./main');
}

