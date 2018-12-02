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
2. run: dockervis build -o <output-path>
```
** You can run only ``dockervis build``, default output path will be the current 
directory your docker-compose.yml is located.

#### Node
```
const dockervis = require('docker-visualizer')
dockervis.visualize();
```

