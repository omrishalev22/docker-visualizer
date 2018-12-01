#!/usr/bin/env node

var program = require('commander');
const main = require('./main');
const logger = require('./common/logger/logger');
var fs = require('fs');

function dockerComposeLookup(cb) {
    fs.readdir(process.cwd(), (err, files) => {
        if (files.some(file => file === 'Docker-compose.yml')) {
            cb(true)
        } else {
            cb(false);
            logger.info(`Couldn't find a Docker-compose.yml file in this directory`);
        }
    })
}


program
    .command('build')
    .option('-o, --output', 'Path to output folder')
    .action(function (userInput) {
        let outputPath = typeof userInput !== "string" ? console.warn('No output path given, will be saved on current directory') : userInput;
        dockerComposeLookup((isFile) => {
            isFile ? main.yaml2puml(outputPath) : '';
        })

    });

program.parse(process.argv);

module.exports = require('./main');
