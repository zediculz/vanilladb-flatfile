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
        
    }

    //update the initial data by adding bew data
    async insert(newData: any):Promise<void> {
       
        const oD = await this.#load()
        const nDArray = [newData, ...oD.data]
        const nData = { key: oD.key, data: nDArray }
        this.#write(nData)
    }

    #yap(status:string) {
        console.log(`[Db::${status}]`)
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