
//import vanilladb from "@vanilladb/main"
import vanilladb from "./main.ts"

const config = {
    file: "data.json",
    key: "app-data-01",
    defaultData: []
}

const db = await vanilladb.init(config)

const user = {
    name: "ray",
    age: 26
}

//await db.insert(user)

const ds = await db.get()
//console.log(ds)

//const r = await db.query("select where index=1")
const r = await db.query("select where name=jake")
const re = await db.query("select where age=26")

console.log(r)
console.log(re)