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

```js
const Ybdb = require('ybdb')
const db = new Ybdb({storageFile: path.join(__dirname, 'db.yaml')})

db('songs')
	.chain()
	.push({title: 'Song One'})
	.push({title: 'Another Song'})
	.push({title: 'The Song'})
	.value()
	.then(console.log)
	.catch(console.error)
```

`db.yaml`:

```yaml
songs:
  - title: Song One
  - title: Another Song
  - title: The Song
```
