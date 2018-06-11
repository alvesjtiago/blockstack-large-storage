import test from 'tape';
import chunkArray from '../../utils/chunk-array';

test('should chunk array into multiple arrays of chunk size', (t) => {
  const array = ['0', '1', '2', '3', '4'];
  const chunks = chunkArray(array, 2);
  t.equal(3, chunks.length);
  t.end();
});
