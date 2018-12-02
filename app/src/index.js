#!/usr/bin/env node

var program = require('commander');
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
                cb(false);
                logger.info(`Couldn't find a docker-compose.yml file in this directory`);
            }
        })
    }

    program
        .version(pjson.version, '-v, --version')
        .option('-o, --output', 'Path to output folder');


    program
        .command('build')
        .action(function (userInput) {
            let outputPath = typeof userInput !== "string" ? logger.warn('** No output path given, will be saved on'
                + ' current'
                + ' directory, use -o <path> for specific'
                + ' output path'
                + ' **') : userInput;
            dockerComposeLookup((file) => {
                file ? main.visualize(file, outputPath) : '';
            })
        });

    program.parse(process.argv);

    program.args.length === 0 ? program.help() : ''; // console help in case no command was mentioned

} else {
    module.exports = require('./main');
}

