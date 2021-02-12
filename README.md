# DBLP


## Requirements and installation
This application requires NPM and Node.js. Node.js must be able to write to `cache` directory.

### Install node modules
```sh
npm ci
```

### Build the application
```sh
npm run build
```


## Usage

### Fetching data from DBLP

```sh
node ./dist/main.js --action fetch
```

The script will collect data from DBLP and save it inside `cache` directory.

### Getting data
Data will be retrieved from cache and written to stdout in JSON format. No HTTPS requests will be performed.

```sh
node ./dist/main.js --action getAllData
```

There are available three other actions that can be used to group data by author, publication or venue:

```sh
node ./dist/main.js --action getByAuthor
node ./dist/main.js --action getByPublication
node ./dist/main.js --action getByVenue
```

### Using non-standard configuration
```sh
node ./dist/main.js --action getAllData --configuration-file configurations/without-informal.json
```

## Configuration files

Configuration files are in JSON format:
```json
{
    "apiUrl": string;, // e.g. "https://dblp.uni-trier.de"
    "authors": string[], // e.g. ["John Doe", "Jane Smith"]
    "cacheKey": string, // e.g. "default"
    "years": number[] | { from: number, to: number } | null, // Ignored by fetch action; e.g. [2015, 2016, 2020] or { "from": 2018, "to": 2021 }
    "excludePublicationTypes": string[] // Ignored by fetch action; e.g. ["Informal Publications"]
}
```
Default configuration is in `src/configuration/defaultConfiguration.ts` and `dist/configuration/defaultConfiguration.js`. These values are used for properties that are not specified in custom configuration.