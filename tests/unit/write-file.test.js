import test from 'tape';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import fs from 'fs';
import path from 'path';

const requestPromiseMock = sinon.stub()
  .returns(new Promise((resolve) => {
    resolve();
  }));

const largeStorage = proxyquire('../../index', {
  blockstack: {
    putFile: requestPromiseMock,
  },
});

test('should return resolve promise on small file when writing', (t) => {
  largeStorage.writeFile('test.js', 'test')
    .then(() => {
      t.true(true);
      t.end();
    });
});

test('should return resolve promise on big file when writing', (t) => {
  fs.readFile(path.resolve(__dirname, '../data/test.jpg'), null, (err, nb) => {
    const ab = nb.buffer;
    largeStorage.writeFile(ab, 'test.jpg')
      .then(() => {
        t.true(true);
        t.end();
      });
  });
});
