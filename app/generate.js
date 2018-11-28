function generateContainersForPuml(data) {
    // go over the services key
    let str = '';
    for (let service in data.services) {
        generateContainersRelationsToRoot(service);
        str += jsonToPuml(data.services, service) + "\n";

    }

    return str;
}

function generateContainersRelationsToRoot(service) {
    containerRelations += `ROOT --> ${service}\n`;
}

function jsonToPuml(data, serviceName) {
    const service = data[serviceName];
    let pumlObject = `rectangle "${serviceName}" COLOR_SERVICE {\n#CONTAINERS}`;
    let str = '';
    for (let command in service) {
        str += `rectangle "**${command.toUpperCase()}:** ${service[command]}" as ${command.toUpperCase()}\n`
    }
    return pumlObject.replace('#CONTAINERS', str);
}