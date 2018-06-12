import test from 'tape';
import appendBuffer from '../../utils/append-buffer';

test('should append one buffer to the other', (t) => {
  const mainBuffer = new Uint8Array([1, 2]).buffer;
  const appendingBuffer = new Uint8Array([3, 4]).buffer;
  const totalBuffer = appendBuffer(mainBuffer, appendingBuffer);
  t.equal(4, totalBuffer.byteLength);
  t.end();
});

test('should append last buffer element to first element', (t) => {
  const mainBuffer = new Uint8Array([1, 2]).buffer;
  const appendingBuffer = new Uint8Array([3, 4]).buffer;
  const totalBuffer = appendBuffer(mainBuffer, appendingBuffer);
  t.same(new Uint8Array(totalBuffer), new Uint8Array([1, 2, 3, 4]));
  t.end();
});
