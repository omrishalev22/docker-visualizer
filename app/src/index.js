const fs = require('fs');
const YAML = require('yamljs');
const plantuml = require('node-plantuml');

const logger = require('./common/logger/logger');
const generator = require('./common/visualizer-generator/generator');

// Dockerfile input
const DEFAULT_PUML = "default.puml";
const NEW_PUML_LOCATION = "output/testing.puml";
const DOCKER_COMPOSE_DEFAULT = "testing-files/Docker-compose.yml"; // HARD CODED should accept file from cmd

const dockerComposeFile = fs.createReadStream(DOCKER_COMPOSE_DEFAULT);
const dockerComposeJson = YAML.parseFile(DOCKER_COMPOSE_DEFAULT);

let servicesList = {native: [], custom: []};

dockerComposeFile.on('data', () => {
    // read from the DEFAULT_PUML and update it
    fs.readFile(DEFAULT_PUML, 'utf8', function (err, data) {

        err ? logger.onError(err) : ''; // handle readFile errors

        const final_puml = data
            .replace(/#CHANGE_VERSION_NUMBER/g, dockerComposeJson.version)
            .replace(/#ADD_YOUR_NATIVE_CONTAINERS_HERE/g,
                     generator.generateNativeContainersForPuml(servicesList, dockerComposeJson, "COLOR_SERVICE"))
            .replace(/#ADD_YOUR_CUSTOM_CONTAINERS_HERE/g,
                     generator.generateCustomContainersForPuml(servicesList, dockerComposeJson, "COLOR_VRM_APPS"))
            .replace(/#CHANGE_RELATIONS/g, generator.generateContainersRelations(servicesList));

        fs.writeFile(NEW_PUML_LOCATION, final_puml, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }

            let gen = plantuml.generate(NEW_PUML_LOCATION);
            gen.out.pipe(fs.createWriteStream("output/output-file.png"));
        });

    });
});

