import test from 'tape';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import fs from 'fs';
import path from 'path';

test('should return resolve promise with file on small file when reading', (t) => {
  const stringTestContent = 'test';
  const stringRequestPromiseMock = sinon.stub()
    .returns(new Promise((resolve) => {
      resolve(stringTestContent);
    }));
  const largeStorage = proxyquire('../../index', {
    blockstack: {
      getFile: stringRequestPromiseMock,
    },
  });

  largeStorage.readFile('test.js')
    .then((content) => {
      t.equal(content, stringTestContent);
      t.end();
    })
    .catch(() => {
      t.true(false);
      t.end();
    });
});

test('should return resolve promise with file on big file when reading', (t) => {
  const fileTestContentPath = path.resolve(__dirname, '../data/test.jpg');
  const fileArrayBuffer = fs.readFileSync(fileTestContentPath, null).buffer;
  const fileRequestPromiseMock = sinon.stub()
    .returns(new Promise((resolve) => {
      resolve(fileArrayBuffer);
    }));

  const largeStorage = proxyquire('../../index', {
    blockstack: {
      getFile: fileRequestPromiseMock,
    },
  });

  largeStorage.readFile('test.js')
    .then((content) => {
      t.equal(content, fileArrayBuffer);
      t.end();
    })
    .catch(() => {
      t.true(false);
      t.end();
    });
});
