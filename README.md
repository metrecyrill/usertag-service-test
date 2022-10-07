##TEST API USER TAG

# Task
- [task document](./TASK.md)

## 

<a name="deployment"></a>
## Deployment
### Prerequisites

Install [Docker](https://www.docker.com/) on your system.

* [Install instructions](https://docs.docker.com/installation/mac/) for Mac OS X
* [Install instructions](https://docs.docker.com/installation/ubuntulinux/) for Ubuntu Linux
* [Install instructions](https://docs.docker.com/installation/) for other platforms

Install [Docker Compose](http://docs.docker.com/compose/) on your system.

* Python/pip: `sudo pip install -U docker-compose`
* Other: ``curl -L https://github.com/docker/compose/releases/download/1.1.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose; chmod +x /usr/local/bin/docker-compose``

<a name="setup"></a>
### Setup

Create `.env` file in each module folder following `.env.example`. Run:
```bash
docker-compose build
```

<a name="start"></a>
### Start

To create and start the application containers run:
```bash
docker-compose up
``` 
The services can be run on the background with command:
 ```bash
 docker-compose up -d
 ``` 

<a name="stop"></a>
### Stop the system
Stopping all the running containers is also simple with a single command:
```bash
docker-compose down
```
If you need to stop and remove all containers, networks, and all images used by any service in  _docker-compose.yml_  file, use the command:
```bash
docker-compose down --rmi all
```


## Stay in touch

- Author - Kirill Mitroshev


## License

Nest is [MIT licensed](LICENSE).
