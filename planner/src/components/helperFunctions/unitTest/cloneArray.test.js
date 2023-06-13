const cloneArray = require('../cloneArray.js');

test('Clone array', () => {
    const arr = [1, 2, 3];
    expect(cloneArray(arr)).toEqual([1, 2, 3]);
    expect(cloneArray(arr)).not.toBe([1, 2, 3]);
})