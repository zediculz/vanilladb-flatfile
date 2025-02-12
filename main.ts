// deno-lint-ignore-file
import type { DBCONFIG } from './types.ts'

/**
 * A class to represent a VanillaDb flatFile Database.
 */

class VanillaDb {
  /** The config of the database. */
  private config: DBCONFIG;

  /**
   * Create new VanillaDb with the name of your database file name, 
   * VanillaDb will create new file with the filename
   * @param filename database file name e.g "data.json" or "/db/data.json" if folder already exist
   * @param defaultData the default data to store while initializing db, mostly array
   */
  constructor(filename: string, defaultData:any = []) {
    this.config = {file: filename, defaultData: defaultData };
    this.#init()
  }

  //initialize to start new db or load existing db 
  async #init(): Promise<VanillaDb> {
    try {
      const fstat = await Deno.lstat(this.config.file);
      this.#yap(`loaded`);
      return this;
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        throw err;
      }

      this.#yap(`initialized......`);
      this.#yap(`loaded`);

      const dD = {
        data: this.config.defaultData
      };

      await this.#write(dD);
      return this;
    }
  }

  /**
   * get return all datas in db
  */
  async get(): Promise<any> {
    const data = await this.#read();
    return data.data;
  }

  /** set store new data to db
   * vanillaDb append new data to the begining by merging together all datas
   * @param newData new data to store in db
   * @param newData can be an array, object, string and numbers
  */
  async set(newData: any): Promise<void> {
    const oD = await this.#read();
    const nDArray = [newData, ...oD.data];
    const nData = { data: nDArray };
    await this.#write(nData);
  }

  /** 
   * @param querystring query uses querystring to get data from db eg
   *  to select data with index 0 the query string will be db.query("select where index=0") return the data in index 0
   *   query can be used to select data and delete data with index or id eb "delete where id=0" remove data from index 0
   * query can also be used to update data eg "update where id=0 value=newdata"
  */
  async query(querystring: string): Promise<any> {
    
    const sql = querystring === "" ? "" : querystring.split(" ");
    const action = querystring === "" ? "" : sql[0];
    const whereToAct = querystring === "" ? ""  : sql[1];
    const [option, value] = querystring === "" ? ""  : sql[2].split("=");

    const oD = await this.#read();
    const datas = oD.data;

    if (action === "select" && whereToAct === "where") {
      if (option === "id" || option === "index") {
        const indexData = datas[value];
        const iD = indexData === undefined ? undefined : indexData;
        return iD;
      } else {
        const filter = datas.filter((data: any) => {
          if (data.hasOwnProperty(option)) {
            if (typeof data[option] === "number") {
              if (data[option] === Number(value)) {
                return data;
              }
            } else {
              if (data[option] === value) {
                return data;
              }
            }
          }
        });

        const fD = filter.length > 1 ? filter : filter[0];
        return fD;
      }
    }

    if (action === "update" && whereToAct === "where") {
      const updateValue = sql[3].split("=");
      const newData = JSON.parse(updateValue[1]);

      if (option === "index" || option === "id") {
        if (datas[value] !== undefined) {
          datas[value] = newData;
          const nD = {
            key: oD.key,
            data: datas,
          };

          await this.#write(nD);
          this.#yap(`${value} updated`);
          return true;
        } else {
          this.#yap("non-existing index");
          return undefined;
        }
      }
    }

    if (action === "delete" && whereToAct === "where") {
      const oD = await this.#read();
      const datas = oD.data;

      if (option === "index" || option === "id") {
        const indexValue = Number(value);
        const filtered = datas.filter((data: any, i: number) => {
          if (i !== indexValue) return data;
        });

        const check = datas[indexValue];
        if (check !== undefined) {
          const nD = {
            key: oD.key,
            data: filtered,
          };

          await this.#write(nD);
          this.#yap(`index: ${indexValue} deleted`)
          return true
        } else {
          return false
        }
      }
    }
  }


  /**
   * db activities logger
  */
  #yap(status: string, option: string = "s"): void {
    const color = option === "s" ? "lime" : "red";
    console.log(`%c[vanillaDb: ${status}]`, `color: ${color}`);
  }


  /**
   * helper to write db
  */
  async #write(defaultData: any): Promise<void> {
    const dD = JSON.stringify(defaultData, null, 1);
    const encoder = new TextEncoder();
    const data = encoder.encode(dD);
    await Deno.writeFile(this.config.file, data);
  }

  /**
   * helper to read db
  */
  async #read(): Promise<any> {
    const fileData = await Deno.readFile(this.config.file);
    const decoder = new TextDecoder();
    const sD = decoder.decode(fileData);
    const data = JSON.parse(sD);
    return data;
  }
}


export default VanillaDb;