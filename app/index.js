var fs = require('fs');
const YAML = require('yamljs');

var output = "rectangle \"Root\"{ADD_CONTAINERS_HERE}";

// Dockerfile input
const DEFAULT_PUML = "default.puml";
const NEW_PUML = "testing.puml";
const DOCKER_COMPOSE_DEFAULT = "Docker-compose.yml";

let input = fs.createReadStream(DOCKER_COMPOSE_DEFAULT);
let dockerComposeJson = YAML.parseFile(DOCKER_COMPOSE_DEFAULT);
let servicesList = {native: [], custom: []};

input.on('data', (data) => {

    // read from the DEFAULT_PUML and update it
    fs.readFile(DEFAULT_PUML, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let final_puml = data
            .replace(/#CHANGE_VERSION_NUMBER/g, dockerComposeJson.version)
            .replace(/#ADD_YOUR_NATIVE_CONTAINERS_HERE/g, generateNativeContainersForPuml(dockerComposeJson,"COLOR_SERVICE"))
            .replace(/#ADD_YOUR_CUSTOM_CONTAINERS_HERE/g, generateCustomContainersForPuml(dockerComposeJson,"COLOR_VRM_APPS"))
            .replace(/#CHANGE_RELATIONS/g, generateContainersRelations(servicesList));

        fs.writeFile(NEW_PUML, final_puml, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
});

/*************************** Generate function ******************************/

function generateNativeContainersForPuml(data,color) {
    // go over the services key
    let str = '';
    for (let service in data.services) {
        if (!data.services[service].build) {
            servicesList.native.push(service);
            str += jsonToPuml(data.services, service,color) + "\n";
        }
    }

    return str;
}

function generateCustomContainersForPuml(data,color) {
    // go over the services key
    let str = '';
    for (let service in data.services) {
        if (data.services[service].build) {
            servicesList.custom.push(service);
            str += jsonToPuml(data.services, service,color) + "\n";
        }
    }

    return str;
}

function generateContainersRelations(serviceList) {
    let list = serviceList;
    let nativeServices = list.native;
    let customServices = list.custom;
    let str = `Terminal -[hidden]-> ${'web'}\n`; // center align the terminal box

    for (let index = 0; index < nativeServices -1 ; index++) {
        // set a relation between a service and its next 3 services
        if(serviceList[index + 1]){
            str += createRelationString(serviceList[index], serviceList[index + 1]);
        }

    };

    for (let index = 0; index < customServices - 1; index ++) {
        // set a relation between a service and its next 3 services
        if(serviceList[index + 1]){
            str += createRelationString(serviceList[index], serviceList[index + 1]);
        }

    };

    return str;

}

function createRelationString(a, b) {
    return `${a} -[hidden]-> ${b}\n`;
}

/**
 * turn json foramt into a plantUml format
 * @param data
 * @param serviceName
 * @returns {string}
 */
function jsonToPuml(data, serviceName,color) {
    const service = data[serviceName];
    let pumlObject = `Node "${serviceName}" ${color} {\n#CONTAINERS}`;
    let str = '';
    for (let command in service) {
        str +=
            `rectangle "**${command.toUpperCase()}:** ${service[command]}" as ${command.toUpperCase()}_${serviceName}\n`
    }
    return pumlObject.replace('#CONTAINERS', str);
}

function generateContainer(container) {
    var containerJSON = {};
    container.forEach(line => {
        let firstWord = line.replace(/ .*/, '');
        containerJSON[firstWord] = line.replace(firstWord + " ", " ");
    });

    return containerJSON;

}