import test from 'tape';
import toArrayBuffer from 'to-array-buffer';

test('converts file to array buffer', (t) => {
  const file = new File(['test'], 'test.js');
  const ab = toArrayBuffer(file);

  const fr = new FileReader();
  fr.onload = () => {
    const data = fr.result;
    t.deepEqual(ab, data);
    t.end();
  };
  fr.readAsArrayBuffer(file);
});
