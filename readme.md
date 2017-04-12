# YBDB

**Y**AML **B**ased **D**ata**b**ase

Uses [lowdb](https://github.com/typicode/lowdb) for
accessing and manipulating data.
The storage consists of one/several YAML files.


## Installation

```shell
npm install --save ybdb
```


## Usage

`songs.yaml`:

```yaml
- title: Song One
  length: 02:16

- title: Another Song
  length: 01:33

- title: The Song
  length: 03:41
```

```js
const Ybdb = require('ybdb')
const database = new Ybdb({
  storageFile: path.join(__dirname, 'songs.yaml'),
})
const initializedDb = await database.init()
const expectedData = {
  songs: [
    {
      title: 'Song One',
      length: '02:16',
    },
    {
      title: 'Another Song',
      length: '01:33',
    },
    {
      title: 'The Song',
      length: '03:41',
    }
  ]
}

assert.deepEqual(initializedDb.getState(), expectedData)
```
