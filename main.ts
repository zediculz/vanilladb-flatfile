// deno-lint-ignore-file

export type DBCONFIG = {
  file: string;
  defaultData: any[];
};

/**
 * A class to represent a VanillaDb flatFile Database.
 */

class VanillaDb {
   /** The config of the database. */
  private config: DBCONFIG;

  /**
   * Create a new VanillaDb with the given config.
   * config parameters will be
   * @param file The name file db.
   */
  constructor(file: string) {
    this.config = {file: file, defaultData: [] };
    this.#init()
  }

  /* initialize to start new db or load existing db */
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
        data: []
      };

      await this.#write(dD);
      return this;
    }
  }

  //get all the stored datas
  /** Get All Data from Db. */
  async get(): Promise<any> {
    const data = await this.#read();
    return data.data;
  }

  //set data, append new data
  /** Set store new Data to Db by appending  */
  async set(newData: any): Promise<void> {
    const oD = await this.#read();
    console.log(oD)
    const nDArray = [newData, ...oD.data];
    const nData = { data: nDArray };
    await this.#write(nData);
  }

  /** Query uses querystring to get data from db e,g
   * db.query("select where index=0") return the data in index 0
   * select, update and delete query are accept
  */
  async query(querystr: string): Promise<any> {
    const sql = querystr.split(" ");
    const action = sql[0];
    const whereToAct = sql[1];
    const [option, value] = sql[2].split("=");

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
          return `index: ${indexValue} deleted`;
        } else {
          return "non-existing index";
        }
      }
    }
  }

  #yap(status: string, option: string = "s"): void {
    const color = option === "s" ? "lime" : "red";
    console.log(`%c[vanillaDb: ${status}]`, `color: ${color}`);
  }

  async #write(defaultData: any): Promise<void> {
    const dD = JSON.stringify(defaultData, null, 1);
    const encoder = new TextEncoder();
    const data = encoder.encode(dD);
    await Deno.writeFile(this.config.file, data);
  }

  async #read(): Promise<any> {
    const fileData = await Deno.readFile(this.config.file);
    const decoder = new TextDecoder();
    const sD = decoder.decode(fileData);
    const data = JSON.parse(sD);
    return data;
  }
}


export default VanillaDb;