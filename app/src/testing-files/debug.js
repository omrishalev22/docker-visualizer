const fs = require('fs');
const plantuml = require('node-plantuml');
const pyyaml = require('pyyaml');
const path= require('path');

let body = '';
let dictionary = {};
let counter = 0;


// Dockerfile input
const DEFAULT_PUML = '/home/shalevo/dev/docker-visualizer/app/src/common/visualizer-generator/default.puml';
const NEW_PUML_LOCATION = '/home/shalevo/dev/docker-visualizer/app/src/testing-files/debug.js'
const OUTPUT_LOCATION = path.resolve(process.cwd(),'docker-compose-visualization.png');


function parseYaml2Puml(data) {
    scan(data); // recursive function
    return body;
}

/**
 * Recursivly scans json file, reaches all children
 * counter - help us managing the level of digging - 0 big parent, 1 child of that parent ...
 * dictionary - since each container consists of UID, dictionary manages conenction for future relation sets.
 * it will form an array based on the services available
 * @param parent
 */
function scan(parent) {
    let child;
    if (parent instanceof Object && !Array.isArray(parent)) {
        for (child in parent) {
            if (parent.hasOwnProperty(child)) {
                let UID = createID();
                addToDictionary(child,counter,UID);
                body += `${createEmptySpace(counter)} rectangle "${child.toUpperCase()}" as ${UID} COLOR_${counter} { \n`;
                counter++;
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

let index = -1;
dictionary['allKeys'] = []; // will be all nodes name + their UID.
dictionary['services'] = []; // will be all nodes name + their UID.
function addToDictionary(childName, level, UID) {
    if (level == 1) { // a service
        index++;
        dictionary['relationsGroup' + index] = [];
        dictionary['services'].push(UID);
    }
    if (level == 2) { // container inside a service, should be have relationship
        (dictionary['relationsGroup' + index]).push(UID);
    }
    dictionary['allKeys'].push({[childName]: UID});
}

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

function formRelations(dic) {
    let counter = 0; // first group is set to 1
    let str = '';

    if(dic['services'].length > 1){
        const services = dic['services'];
        for (let i = 0; i < services.length - 1; i ++) {
            str += `${services[j]} -[hidden]down-> ${services[j + 1]} \n`
        }
    }

    while (dic['relationsGroup' + counter]) {
        const group = dic['relationsGroup' + counter];
        for (let i = 0; i < group.length - 1; i += 2) {
            str += `${group[i]} -[hidden]down-> ${group[i + 1]} \n`
        }
        counter++;
    }

    return str;
}

pyyaml.load('/home/shalevo/dev/docker-visualizer/app/src/testing-files/Docker-compose.yml', function (err, jsObject) {
    fs.readFile(DEFAULT_PUML, 'utf8', function (err, data) {
        if (err) throw err;
        let final_content = data
            .replace(/#REPLACE_WITH_CONTAINERS_HERE/g, parseYaml2Puml(jsObject))
            .replace(/#CHANGE_RELATIONS/g, formRelations(dictionary));
        puml2Png(final_content);
        cb({dictionary:dictionary});
    });
});