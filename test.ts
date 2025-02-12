
import VanillaDb from "@vanilladb/main";

const db = new VanillaDb("data.json")

const datas = await db.get()

//const d = await db.query("select where id=0")
//const dd = await db.query("select where id=120")
//const ddd = await db.query("update where index=1 value=3400")

db.query("")
console.log(datas)