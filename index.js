import { getFile, putFile } from 'blockstack';
import toArrayBuffer from 'to-array-buffer';
import { appendBuffer } from './utils/append-buffer';
import { chunkArray } from './utils/chunk-array';

const prefix = 'multifile:';

/**
 * Write files to blockstack storage regardless of size
 * @param  {String} path - the path to store the data in
 * @param  {String|Buffer|File} - the data to store in the file
 * @param {Object} [options=null] - options object
 * @param {Boolean} [options.encrypt=true] - encrypt the data with the app private key
 * @return {Promise} that resolves if the operation succeed and rejects if it failed
 */
function writeFile(path, content, options) {
  // Turn contents into array buffer
  const arrayBuffer = toArrayBuffer(content);
  // Calculate array buffer size in MB
  const mb = arrayBuffer.byteLength / 1000000.0;
  // Adjust the MB cap according to encription
  const processedOptions = options || {};
  const mbCap = (processedOptions.encrypt === true || processedOptions.encrypt == null) ? 4 : 5;

  // If the size of the buffer is larger than the cap, chunk file
  if (mb > mbCap) {
    return new Promise((resolve, reject) => {
      const array = new Uint8Array(arrayBuffer);

      let chunkSize = 4000000;
      if (processedOptions.encrypt === true || processedOptions.encrypt == null) {
        chunkSize = 3000000;
      }
      const arrayOfFilesBytes = chunkArray(array, chunkSize);

      // Write main file
      let paths = '';
      arrayOfFilesBytes.forEach((element, index) => {
        const newPath = `${path}_part${index}`;
        paths = `${paths}${newPath},`;
      });
      const mainContent = prefix + paths;
      putFile(path, mainContent, options);

      // Write file parts
      const promises = [];
      arrayOfFilesBytes.forEach((element, index) => {
        const newPath = `${path}_part${index}`;
        promises.push(putFile(newPath, element, options));
      });
      Promise.all(promises)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  // Default return of blockstack's putFile if file is smaller than cap size
  if (typeof content === "string") {
    return putFile(path, content, processedOptions);
  }
  return putFile(path, arrayBuffer, processedOptions);
}

/**
 * Retrieves the specified file from the app's data store and aggregates
 * if multifile file is found
 * @param {String} path - the path to the file to read
 * @param {Object} [options=null] - options object
 * @param {Boolean} [options.decrypt=true] - try to decrypt the data with the app private key
 * @param {String} options.username - the Blockstack ID to lookup for multi-player storage
 * @param {String} options.app - the app to lookup for multi-player storage -
 * defaults to current origin
 * @param {String} [options.zoneFileLookupURL=null] - The URL
 * to use for zonefile lookup. If falsey, this will use the
 * blockstack.js's getNameInfo function instead.
 * @returns {Promise} that resolves to the raw data in the file
 * or rejects with an error
 */
function readFile(path, options) {
  return new Promise((resolve, reject) => {
    getFile(path, options)
      .then((file) => {
        if (typeof file === 'string') {
          const fileString = String(file);
          if (fileString.length > 10 && fileString.substring(0, 10) === prefix) {
            // Get file parts
            let fileNames = fileString.substring(10, fileString.length).split(',');
            fileNames = fileNames.filter(e => e);
            const promises = [];
            fileNames.forEach((element) => {
              promises.push(getFile(element, options));
            });
            Promise.all(promises)
              .then((values) => {
                let totalBytes = values[0];
                values.forEach((element, index) => {
                  if (index !== 0) {
                    totalBytes = appendBuffer(totalBytes, element);
                  }
                });
                resolve(totalBytes);
              });
          } else {
            resolve(file);
          }
        } else {
          resolve(file);
        }
      }).catch(() => {
        reject();
      });
  });
}

export { writeFile, readFile };
