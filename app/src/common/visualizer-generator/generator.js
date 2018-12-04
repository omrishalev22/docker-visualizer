const fs = require('fs');
const plantuml = require('node-plantuml');
const pyyaml = require('pyyaml');
const logger = require('../logger/logger');
const path = require('path');

let body = '';
let dictionary = {};
let counter = 0;

// Dockerfile input
const DEFAULT_PUML = path.resolve(__dirname, "default.puml");
const OUTPUT_LOCATION = path.resolve(process.cwd());
const OUTPUT_FILENAME = "docker-compose-visualization.png";

function parseYaml2Puml(data) {
    scan(data); // recursive function
    return body;
}

/**
 * Recursively scans json file, reaches all children
 * counter - help us managing the level of digging - 0 big parent, 1 child of that parent ...
 * dictionary - since each container consists of UID, dictionary manages connection for future relation sets.
 * it will form an array based on the services available
 * @param parent
 */
function scan(parent) {
    let child;
    if (parent instanceof Object && !Array.isArray(parent)) {
        for (child in parent) {
            if (child != 'version') { // version should not be in a container we handle it differently
                if (parent.hasOwnProperty(child)) {
                    let UID = createUID();
                    addToDictionary(child, counter, UID);
                    body += `${createEmptySpace(counter)} rectangle "${child.toUpperCase()}" as ${UID} COLOR_${counter} { \n`;
                    counter++;
                    scan(parent[child]);
                    body += `${createEmptySpace(counter)}}\n`;
                    counter--; // climbing up to initial levels
                }
            }
        }
    } else {
        let UID = createUID();
        dictionary[parent] = UID;
        body += `${createEmptySpace(counter)} rectangle "${parent}" as ${UID}`
    };

    body += '\n'

};

let index = -1;
dictionary['allKeys'] = []; // will be all nodes name + their UID.
dictionary['services'] = []; // will be all nodes name + their UID.
function addToDictionary(childName, level, UID) {
    if (level == 1) { // a service
        index++;
        dictionary['relationsGroup' + index] = [];
        dictionary['services'].push({name: childName, UID: UID});
    }
    if (level == 2) { // container inside a service, should be have relationship
        (dictionary['relationsGroup' + index]).push({name: childName, UID: UID});
    }
    dictionary['allKeys'].push({[childName]: UID});
}

function createUID() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function puml2Png(outputPath, customName, keepPumlFile, content, cb) {
    const outputDirectory = outputPath && checkIsDirectory(outputPath) ? outputPath : OUTPUT_LOCATION;
    const NEW_PUML_LOCATION = path.resolve(outputDirectory, 'docker-compose.puml');
    const fileName = customName ? customName + '.png' : OUTPUT_FILENAME;
    const file = path.resolve(outputPath, fileName);
    fs.writeFile(NEW_PUML_LOCATION, content, 'utf8', function (err) {
        if (err) {
            return logger.error(err);
        }
        const gen = plantuml.generate(NEW_PUML_LOCATION);
        logger.info('Creating PNG...');
        try {
            let stream = gen.out.pipe(fs.createWriteStream(file));
            stream.on('finish', () => {
                logger.info(fileName + ' was created successfully');
                logger.success('File is in the following directory:  ' + outputDirectory);
                // if no mentioned specifically by user (-c option), PUML file will be deleted for png generation
                if (!keepPumlFile) {
                    logger.warn('Generated PUML was deleted, you can keep it for further customization, see documentation');
                    fs.unlinkSync(NEW_PUML_LOCATION)
                }


                cb({
                       resultCode: 200,
                       message: 'Graph was generated successfully',
                       file: path.resolve(outputDirectory,fileName)
                   })
            });

            stream.on('error', (err) => {
                cb({
                       resultCode: -1,
                       message: 'Error during png generation',
                       path: null,
                       err: err
                   });
                logger.error('Oops something went wrong please try again..');
            })
        } catch (e) {
            logger.error(e);
            process.exit(-1);
        }

    });
}

/*
Function used in development mode only
* */
function createEmptySpace(number) {
    let str = '';
    for (let i = 0; i < number; i++) {
        str += '   ';
    }
    return str;
}

function formRelations(dic) {
    let counter = 0; // first group is set to 1
    let str = '';

    if (dic['services'].length > 1) {
        const services = dic['services'];
        for (let i = 0; i < services.length - 1; i++) {
            str += `''Real names: ${services[i].name} ---> ${services[i+1].name}''\n`;
            str += `${services[i].UID} -[hidden]down---> ${services[i + 1].UID}\n\n`
        }
    }

    while (dic['relationsGroup' + counter]) {
        const group = dic['relationsGroup' + counter];
        for (let i = 0; i < group.length - 1; i += 2) {
            str += `''Real names: ${group[i].name} -> ${group[i+1].name}''\n`;
            str += `${group[i].UID} -[hidden]down-> ${group[i + 1].UID}\n\n`
        }
        counter++;
    }

    return str;
}

function checkIsDirectory(path) {
    if (fs.existsSync(path)) {
        return true;
    }
    logger.warn('Invalid output path. using current directory as output instead');
    return false;
}

module.exports = {
    visualize: (file, output, customName, keepPumlFile, cb) => {
        logger.info('Loading docker-compose.yml');
        pyyaml.load(file, function (err, jsObject) {
            // handle readFile errors
            if (err) {
                logger.error('File could not be loaded. Please check the given path: ' + file);
                process.exit(-1);
                return;
            }

            fs.readFile(DEFAULT_PUML, 'utf8', function (err, data) {
                logger.info('docker-compose file is ready to use');
                if (err) throw err;

                let final_content = data
                    .replace(/#CHANGE_VERSION_NUMBER/g, jsObject.version)
                    .replace(/#REPLACE_WITH_CONTAINERS_HERE/g, parseYaml2Puml(jsObject))
                    .replace(/#CHANGE_RELATIONS/g, formRelations(dictionary));
                puml2Png(output, customName, keepPumlFile, final_content, (res) => {
                    cb(res);
                })
            });
        });
    }
}




