
import vanilladb from "@vanilladb/main";
const config = {
    file: "data.json",
    key: "app-data-01",
    defaultData: []
}

const db = await vanilladb.init(config)

console.log(db)