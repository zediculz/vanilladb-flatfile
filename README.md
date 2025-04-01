[![JSR](https://jsr.io/badges/@vanilladb/main)](https://jsr.io/@vanilladb/main)

# VanillaDb

A lightweight, flat-file database that stores data in json file:

- 🚀 Zero dependencies
- 🔌 Less API
- 🛠️ Full TypeScript type inference

## Installation

```bash
deno add jsr:@vanilladb/main
```

## Usage

### Basic Class Example
```javascript

import VanillaDb from "@vanilladb/main";


//create VanillaDb
const db = new VanillaDb({
    file: "filename.json",
    label: "db",
    defaultData: [],
    log: true
})

//set store new data in db
await db.set({
    id: 0, 
    name: 'john doe'
})

//get returns data in db
const datas = await db.get()

//querystring query uses querystring to get data from db
const result = await db.query("select where index=2")
const done = await db.query("update where index=2 value='newdata'")

```

# License

MIT © Ademujimi Oluwaseyi