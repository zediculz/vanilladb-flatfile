[![JSR](https://jsr.io/badges/@<vanilladb>/<main>)](https://jsr.io/@<vanilladb>/<main>)

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
const db = new VanillaDb("data.json")


const datas = await db.get()
```


# License

MIT © Ademujimi Oluwaseyi