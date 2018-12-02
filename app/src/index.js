#!/usr/bin/env node

var program = require('commander');
const main = require('./main');
const logger = require('./common/logger/logger');
const fs = require('fs');
const path = require('path');

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
    .command('build')
    .option('-o, --output', 'Path to output folder')
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

module.exports = require('./main');
