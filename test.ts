
//import VanillaDb from "@vanilladb/main";
import VanillaDb from "./main.ts"


const db = new VanillaDb({
    file: "filename.json",
    label: "db",
    defaultData: [],
    log: true
})

console.log(db)