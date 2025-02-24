# WAIVE Sampler Database Manager

Basic database manager to update and edit the remote database that serves the plugin [WAIVE-Sampler](https://github.com/ThunderboomRecords/WAIVE).

Built on [node.js](https://nodejs.org/), [express.js](https://expressjs.com/), [SQLite](https://www.sqlite.org/), and [Bootstrap](https://getbootstrap.com/).

## Installation
Clone this repo to an appropriate location, then install dependencies and run the server:
```shell
$ git clone https://github.com/ThunderboomRecords/WAIVE-database-server
$ cd WAIVE-database-server
$ npm install
$ npm run start
```

### Configuration
Create a `.env` file at the root of this repo with the following entries:
```properties
PORT=3000
ROOT='/'
USERNAME=admin
PASSWORD=password
UPLOADS_DIR='uploads/'
BACKUPS_DIR='backups/'
DATABASE_FILE='data.db'
```
The example above indicates the default values.

Make sure `PORT` is a valid and usable port to serve requests.
`ROOT` is the root path of the URL. 
For example, if this server should have a domain name `www.example.com/some/path` then `ROOT='/some/path'`.
`ROOT` must begin with `/` and does not need to end with it.

There is only one user account whos credentials can only be set by `USERNAME` and `PASSWORD`.
Set a stronger password than the default!

If `UPLOADS_DIR`, `BACKUPS_DIR` or `DATABASE_FILE` begins with a `/` it is treated as an absolute path, otherwise it is relative from this repo.
The `UPLOADS_DIR` is where all the uploaded media files are stored, so make sure there is plenty of disk space avaliable.

You may specify a different config file when running the server, e.g. `$ npm run start /path/to/config.env`
