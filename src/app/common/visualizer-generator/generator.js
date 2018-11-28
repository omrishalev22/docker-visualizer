module.exports = {
    generateNativeContainersForPuml: function generateNativeContainersForPuml(servicesList, data, color) {
        // go over the services key
        let str = '';
        for (let service in data.services) {
            if (!data.services[service].build) {
                servicesList.native.push(service);
                str += this.jsonToPuml(data.services, service, color) + "\n";
            }
        }

        return str;
    },
    generateCustomContainersForPuml: function generateCustomContainersForPuml(servicesList, data, color) {
        // go over the services key
        let str = '';
        for (let service in data.services) {
            if (data.services[service].build) {
                servicesList.custom.push(service);
                str += this.jsonToPuml(data.services, service, color) + "\n";
            }
        }

        return str;
    },
    generateContainersRelations: function generateContainersRelations(serviceList) {
        let list = serviceList;
        let nativeServices = list.native;
        let customServices = list.custom;
        let str = `Terminal -[hidden]-> ${'web'}\n`; // center align the terminal box

        for (let index = 0; index < nativeServices - 1; index++) {
            // set a relation between a service and its next 3 services
            if (serviceList[index + 1]) {
                str += createRelationString(serviceList[index], serviceList[index + 1]);
            }

        };

        for (let index = 0; index < customServices - 1; index++) {
            // set a relation between a service and its next 3 services
            if (serviceList[index + 1]) {
                str += createRelationString(serviceList[index], serviceList[index + 1]);
            }

        };

        return str;

    },
    createRelationString:
        function createRelationString(a, b) {
            return `${a} -[hidden]-> ${b}\n`;
        },
    jsonToPuml: function jsonToPuml(data, serviceName, color) {
        const service = data[serviceName];
        let pumlObject = `Node "${serviceName}" ${color} {\n#CONTAINERS}`;
        let str = '';
        for (let command in service) {
            str +=
                `rectangle "**${command.toUpperCase()}:** ${service[command]}" as ${command.toUpperCase()}_${serviceName}\n`
        }
        return pumlObject.replace('#CONTAINERS', str);
    }

}






