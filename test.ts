
//import vanilladb from "@vanilladb/main"
import vanilladb from "./main.ts"

const config = {
    file: "data.json",
    key: "app-data-01",
    defaultData: []
}

const db = await vanilladb.init(config)

const user = {
    name: "jay",
    age: 16
}

//await db.insert(user)

const ds = await db.get()


const re = await db.query("select where name=jacob")
const res = await db.query("select where age=28")
const ress = await db.query("select where index=1")


//console.log(re)
console.log(res)
//console.log(ress)

const ur = JSON.stringify({
    name: "paul",
    age: 28
})

//const r = await db.query(`update where index=2 value=${ur}`)


const d = await db.query(`delete where index=2`)
console.log(d)