# PocketBase project

## Start

```sh
./pocketbase serve
```

Then open the admin UI at <http://127.0.0.1:8090/_/>. On the very first run
PocketBase prints a one-time link for creating the superuser account. The REST
API is served from <http://127.0.0.1:8090/api/>.

Useful flags:

```sh
./pocketbase serve --http 0.0.0.0:8090   # listen on all interfaces
./pocketbase --help                      # every subcommand
```

### Using npm scripts

If this project already has a `package.json`, add a script so the usual
`npm start` works — no extra package is needed, the binary is already here:

```json
{
  "scripts": {
    "start": "./pocketbase serve"
  }
}
```

Then:

```sh
npm start
```

## Layout

| Path             | What it is                                              |
| ---------------- | ------------------------------------------------------- |
| `pocketbase`     | The server binary. Git-ignored — install it per machine. |
| `pb_hooks/`      | JavaScript hooks, loaded on start. Edit `main.pb.js`.    |
| `pb_migrations/` | Schema migrations, applied automatically on start.       |
| `pb_data/`       | Database and uploads. Git-ignored.                       |
| `pbc.json`        | Records the pinned PocketBase version.                   |

## Managing the binary

The binary and `pb_data/` are git-ignored, so a fresh clone needs the binary
installed before it can start. Using the `pbc` CLI:

```sh
pbc init               # install the pinned version and scaffold
pbc install <version>  # switch to a specific version
pbc versions           # list available versions
pbc which              # show the installed binary and its pin
```

Otherwise download it from <https://github.com/pocketbase/pocketbase/releases>
and unzip it next to this file.

## Docs

- Hooks: <https://pocketbase.io/docs/js-overview/>
- Migrations: <https://pocketbase.io/docs/js-migrations/>
