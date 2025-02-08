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

    async query(querystr:string):Promise<any> {
        const sql = querystr.split(" ")
        const action = sql[0]
        const whereToAct = sql[1]
        const [option, value] = sql[2].split("=")

        if (action === "select" && whereToAct === "where") {
            const oD = await this.#load()
           
            const datas = oD.data

            if (option !== "index") {
                const filter = datas.filter((data:any) => {
                    if (data.hasOwnProperty(option)) {
                        if (typeof data[option] === "number") {
                            if (data[option] === Number(value)) {
                                return data
                            }
                        } else {
                            if (data[option] === value) {
                                return data
                            }
                        }
                    } 
                })

               
                const fD = filter.length > 1 ? filter : filter[0]
                return fD
            } else {
                const indexData = datas[value]
                const iD = indexData === undefined ? [] : indexData
                return iD
            }
        }

        if (action === "update" && whereToAct === "where") {

            const oD = await this.#load()
            const datas = oD.data

            const updateValue = sql[3].split("=")
            const newData = JSON.parse(updateValue[1])
           
            if (option === "index" || option === "id") {

                if (datas[value] !== undefined) {
                    datas[value] = newData
                    const nD = {
                        key: oD.key,
                        data: datas
                    }

                    await this.#write(nD)
                    return `index: ${value} updated`
                } else {
                    return "non-existing index"
                }
            }
        }

        if (action === "delete" && whereToAct === "where") {

            const oD = await this.#load()
            const datas = oD.data
           
            if (option === "index" || option === "id") {
                const indexValue = Number(value)
                const filtered = datas.filter((data: any, i:number) => {
                    if(i !== indexValue) return data
                })

                const check = datas[indexValue]
                if (check !== undefined) {
                    const nD = {
                        key: oD.key,
                        data: filtered
                    }

                    await this.#write(nD)
                    return `index: ${indexValue} deleted`
                } else {
                    return "non-existing index"
                }
                
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

    #yap(status:string):void {
        console.log(`[VanillaDb::${status}]`)
    }

    async #write(defaultData:any):Promise<void> {
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