Docker-visualizer
=================================================

This package helps you visualize docker-compose 
files in as a simple graph. 
Docker-visualizer offers both node implementation and CLI.

DEMO
------------
![alt text](https://github.com/omrishalev22/docker-visualizer/blob/master/example.png?raw=true)


Installation
------------
```
npm install docker-visualizer
```

###### For CLI access install globally
```
npm install docker-visualizer -g
```
#### Dependencies
Package uses "graphviz" as a tool to visualize the parsed
docker-compose file.

For Linux users:

```
sudo apt install graphviz
```

For Windows users:
```
- Go to Graphviz download page:
https://graphviz.gitlab.io/_pages/Download/Download_windows.html
- install zip file and run installer.
** you might need to restart computer 
```

USAGE
------------

#### CLI
After installing globally you can use the command line

```
1. Go to the docker-compose.yml directory
2. run: dockervis build  <output-path>
```
 Examples for advanced commands:
 ```
 dockervis build  ../../outputPath -n customFileName -c
 ```
 - -n or --name will change the default name given to the output file
 - -c or --custom will keep the puml created alongside program for further customization. 

#### Node
```
const dockervis = require('docker-visualizer')
dockervis.visualize(file, output, customName?, keepPumlFile?).then(res => {
    // res will be given after PNG file was created
});
```
Output path to file is mandatory, customName is optional.
KeepPumlfile option keeps raw PUML generated from docker-compose.yml, helpful for
further customization
** for working with PUML files in your IDE, you should install PlantUML plugin

