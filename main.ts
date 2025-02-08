// deno-lint-ignore-file
import type { DBCONFIG } from "./type.ts"


class VanillaDb {
    fileLink: string
    config: DBCONFIG
    fstat: {blocks: any, size: any}

    constructor() {
        this.fileLink = ""
        this.config = { key: "", file: "", defaultData: [] }
        this.fstat = {blocks: 0, size: 0}
    }

    async init(config: DBCONFIG):Promise<VanillaDb> {
        this.config = config
        try {
            this.fileLink = config.file
            const fstat = await Deno.lstat(config.file)
            this.fstat = {blocks: fstat.blocks, size: fstat.blksize}
            this.#yap("loaded")
            return this

        } catch (err) {
            if (!(err instanceof Deno.errors.NotFound)) {
                throw err
            }

            this.#yap("initialized....")
            this.#yap("loaded")

            const dD = {
                key: config.key,
                data: config.defaultData
            }

            await this.#write(dD)
            return this
        }
    }

    async get():Promise<any> {
        const data = await this.#load()
        return data.data
    }

    async query(querystr:string):Promise<void> {
        const sql = querystr.split(" ")
        const action = sql[0]
        const whereToAct = sql[1]
        const [option, value] = sql[2].split("=")
        console.log(option, value)

        if (action === "select" && whereToAct === "where") {
            const oD = await this.#load()
            const datas = oD.data

            if (option !== "index") {
                const filter = datas.filter((data:any) => {
                    if (data.hasOwnProperty(option) && data[option] === value) {
                        return data
                    } else if (data.hasOwnProperty(option) && typeof data[option] === 'number') {
                        const check = data[option] === Number(value) ? data : []
                        return check
                    }
                })

                return filter[0]
            } else {
                const indexData = datas[value]
                const iD = indexData === undefined ? [] : indexData
                return iD
            }
        }
    }

    //update the initial data by adding bew data
    async insert(newData: any): Promise<void> {
        const oD = await this.#load()
        const nDArray = [newData, ...oD.data]
        const nData = { key: oD.key, data: nDArray }
        await this.#write(nData)
    }

    #yap(status:string) {
        console.log(`[VanillaDb::${status}]`)
    }

    async #write(defaultData:any) {
        const dD = JSON.stringify(defaultData, null, 2)
        const encoder = new TextEncoder()
        const data = encoder.encode(dD)
        await Deno.writeFile(this.fileLink, data)
    }

    async #load():Promise<any> {
        const fileData = await Deno.readFile(this.fileLink)
        const decoder = new TextDecoder()
        const sD = decoder.decode(fileData)
        const data = JSON.parse(sD)
        return data
    }

}


const vanilladb:VanillaDb = new VanillaDb()

export default vanilladb