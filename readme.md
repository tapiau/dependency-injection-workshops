### Dependency Injection Workshop Project

# Do not modify ./src/tests files while working with this project!!!

## Initialization

1. Install project by running command below

```
npm install
```

2. Copy `.env.dist` file into `.env` file e.g. by using command below

```
cp .env.dist .env
```

## How to use

Application is developed in docker environment.

1. Stop and clear your docker environment before running scripts below to avoid possible issues

```
docker kill $(docker ps -q)
docker rm $(docker ps -a -q)
docker system prune -a --force
```

2. To start development environment run

```
npm run d-dev
```

3. To start integration tests run

```
npm run d-test-integrations
```
