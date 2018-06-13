# blockstack-large-storage [![Build Status](https://travis-ci.org/alvesjtiago/blockstack-large-storage.svg?branch=master)](https://travis-ci.org/alvesjtiago/blockstack-large-storage)

Blockstack's Gaia storage only allows writing files up to 5MB. Therefore, this package adds the ability to write and get blockstack files larger than 5MB while maintaining direct compatibility for smaller files.

Larger files are chunked into several smaller ones and a referrence is kept on the original file pointing to each of them. When reading the file, it is put back together and returned as an array buffer via promise.

## Instalation

``` bash
$ npm install blockstack-large-storage --save
```

## Usage

Complete compatibility with [blockstack's storage API](https://blockstack.github.io/blockstack.js/index.html#storage). The ```putFile``` method is here called ```writeFile``` and the ```getFile``` method is ```readFile```.

``` javascript
import { writeFile, readFile } from "blockstack-large-storage";
```

``` javascript
readFile(path: String, options: Object): Promise
writeFile(path: String, content: (String | Buffer), options: Object): Promise
```

## Testing

```bash
npm run test
```