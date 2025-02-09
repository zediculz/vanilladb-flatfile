
//import vanilladb from "@vanilladb/main"
import vanilladb from "./main.ts"

const config = {
    file: "data.json",
    key: "app-data-01",
    defaultData: []
}

const db = await vanilladb.init(config)

//const q = await db.query(`delete where id=0`)
//const qq = await db.query(`update where id=0 value=6`)
//const qqq = await db.query("select where index=10")

//console.log(qqq)

const ds = await db.get()
console.log(ds)
