const fs = require('fs');
const plantuml = require('node-plantuml');
const pyyaml = require('pyyaml');
const logger = require('../logger/logger');

let body = '';
let dictionary = {};
let counter = 0;


// Dockerfile input
const DEFAULT_PUML = "/home/shalevo/dev/docker-visualizer/app/src/common/visualizer-generator/default.puml";
const NEW_PUML_LOCATION = "/home/shalevo/dev/docker-visualizer/app/src/output/testing.puml";
const DOCKER_COMPOSE_DEFAULT = "testing-files/Docker-compose.yml"; // HARD CODED should accept file from cmd

function parseYaml2Puml(data) {
    scan(data); // recursive function
    return body;
}

function scan(parent) {
    var child;
    if (parent instanceof Object && !Array.isArray(parent)) {
        for (child in parent) {
            if (parent.hasOwnProperty(child)) {
                let UID = createID();
                dictionary[child] = UID;
                // create a new cointainer up to level 3 digging
                body += `${createEmptySpace(counter)} rectangle "${child.toUpperCase()}" as ${UID} COLOR_${counter} { \n`;
                counter++
                scan(parent[child]);
                body += `${createEmptySpace(counter)}}\n`;
                counter--; // climbing up to initial levels
            }
        }
    } else {
        let UID = createID();
        dictionary[parent] = UID;
        body += `${createEmptySpace(counter)} rectangle "${parent}" as ${UID}`
    };

    body += '\n'

};

function createID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function puml2Png(content) {
    fs.writeFile(NEW_PUML_LOCATION, content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        let gen = plantuml.generate(NEW_PUML_LOCATION);
        gen.out.pipe(fs.createWriteStream("output/output-file.png"));
    });
}

/*
FUnction used in development mode only
* */
function createEmptySpace(number) {
    let str = '';
    for (let i = 0; i < number; i++) {
        str += '   ';
    }

    return str;

}


module.exports = {
    yaml2puml: function () {
        pyyaml.load('/home/shalevo/dev/docker-visualizer/app/src/testing-files/Docker-compose.yml', function (err, jsObject) {
            fs.readFile(DEFAULT_PUML, 'utf8', function (err, data) {
                err ? logger.onError(err) : ''; // handle readFile errors

                if (err) throw err;
                let final_content = data.replace(/#REPLACE_WITH_CONTAINERS_HERE/g, parseYaml2Puml(jsObject));
                puml2Png(final_content);

            });
        });
    }
}




