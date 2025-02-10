
//import vanilladb from "@vanilladb/main"
import VanillaDb from "./main.ts"


const db = new VanillaDb("data.json")

//const q = await db.query(`delete where id=0`)
//const qq = await db.query(`update where id=0 value=6`)
const qqq = await db.query("select where index=0")

console.log(qqq)

const d = await db.get()
console.log(d)