# WAIVE Sampler Database Manager

A basic database frontend to update and edit the remote database that serves
the music plugin [WAIVE-Sampler](https://github.com/ThunderboomRecords/WAIVE).

Built on [node.js](https://nodejs.org/), [express.js](https://expressjs.com/),
[SQLite3](https://www.sqlite.org/), and [Bootstrap](https://getbootstrap.com/).

## Deploying

```sh
cp .env.example .env
docker compose up -d
```

To move an existing database to the container:

```sh
$ docker run -it -v "/path/to/data.db":/src -v "waive-database-server_db:/data:ro" alpine:3 sh
/ # cp /src/data.db /data/data.db
/ # chmod -R 1000:1000 /data/
/ # exit
```

## Development

Clone this repo to an appropriate location, then install dependencies and run
the server:

```sh
git clone https://github.com/ThunderboomRecords/WAIVE-database-server
cd WAIVE-database-server
npm install
npm run start
```

### Configuration

Create a `.env` file at the root of this repo with the following entries:

```properties
PORT=3000
ROOT='/'
USERNAME=admin
PASSWORD=password
UPLOADS_DIR='uploads/'
```

The example above indicates the default values. This file is ignored by version
control.

Make sure `PORT` is a valid and usable port to serve requests.

`ROOT` is the root path of the URL. For example, if this server should have a
domain name `www.example.com/some/path` then `ROOT='/some/path'`. `ROOT` must
begin with `/` and does not need to end with it.

There is only one user account whose credentials are set by `USERNAME` and
`PASSWORD` fields. Set a stronger password than the default!

The `UPLOADS_DIR` is where all the uploaded media files are stored, so make
sure there is plenty of disk space available.

You may specify a different config file when running the server, e.g. `$ npm
run start /path/to/config.env`
