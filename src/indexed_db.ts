interface GetObjectStoreParams {
  objectStoreName: string;
  mode: IDBTransactionMode;
}

export class IndexedDB {
  db: IDBDatabase | null = null;
  dbName: string;
  dbVersion: number | null = null;

  constructor(dbName: string) {
    this.db;
    this.dbName = dbName;
    this.dbVersion;
  }

  private getObjectStore({
    mode,
    objectStoreName,
  }: GetObjectStoreParams): IDBObjectStore | null {
    if (!this.db) {
      console.error("error: empty DB");
      return null;
    }

    const transaction: IDBTransaction = this.db.transaction(
      objectStoreName,
      mode
    );

    transaction.oncomplete = (_) => {
      console.log("Transaction completed: database modification finished");
    };

    transaction.onerror = (event) => {
      console.error(
        "Transaction not opened due to error: " +
          (event.target as IDBTransaction).error?.message
      );
    };

    return transaction.objectStore(objectStoreName);
  }

  open(dbVersion: number, controlObjectStore?: (db: IDBDatabase) => void) {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        window.alert(
          "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
        );
        reject();
        return;
      }

      this.dbVersion = dbVersion;
      const DBRequest = indexedDB.open(this.dbName, this.dbVersion);

      DBRequest.onsuccess = (_) => {
        this.db = DBRequest.result;
        console.log(
          `Successfully opened DB, name: ${this.dbName}, version: ${this.dbVersion}`
        );

        resolve(this.db);
      };

      DBRequest.onerror = (event) => {
        console.error("error: " + (event.target as IDBRequest).error?.message);
        reject();
      };

      DBRequest.onupgradeneeded = (event) => {
        this.db = (event.target as IDBRequest).result;

        if (!this.db) {
          console.error("error: empty DB");
          return;
        }

        if (!controlObjectStore) return;

        controlObjectStore(this.db);
        resolve(this.db);
      };
    });
  }

  async add(objectStoreName: string, addData: { [key: string]: any }) {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore({
        mode: "readwrite",
        objectStoreName,
      });

      if (!store) {
        reject("empty store!");
        return;
      }

      const addRequest = store.add(addData);

      addRequest.onsuccess = (event) => {
        console.log("success: " + (event.target as IDBRequest).result);
        resolve(store);
      };

      addRequest.onerror = (event) => {
        reject("error: " + (event.target as IDBRequest).error?.message);
      };
    });
  }

  async get(objectStoreName: string, key: number) {
    let result: any = null;

    return new Promise((resolve, reject) => {
      const store = this.getObjectStore({
        mode: "readwrite",
        objectStoreName,
      });

      if (!store) {
        reject("empty store!");
        return;
      }

      const getRequest = store.get(key);

      getRequest.onsuccess = (event) => {
        result = (event.target as IDBRequest).result;

        if (!result) {
          reject("have't value");
        }

        resolve(result);
      };

      getRequest.onerror = (event) => {
        reject("error: " + (event.target as IDBRequest).error?.message);
      };
    });
  }

  async getAll(objectStoreName: string) {
    let result: any[] = [];

    return new Promise((resolve, reject) => {
      const store = this.getObjectStore({
        mode: "readwrite",
        objectStoreName,
      });

      if (!store) {
        reject("empty store!");
        return;
      }

      const getRequest = store.getAll();

      getRequest.onsuccess = (event) => {
        result = (event.target as IDBRequest<any[]>).result;
        resolve(result);
      };

      getRequest.onerror = (event) => {
        reject("error: " + (event.target as IDBRequest).error?.message);
      };
    });
  }

  async put(
    objectStoreName: string,
    putData: { [key: string]: any },
    key: number
  ) {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore({
        mode: "readwrite",
        objectStoreName,
      });

      if (!store) {
        reject("empty store!");
        return;
      }

      const updateReqeusst = store.put(putData, key);

      updateReqeusst.onsuccess = (event) => {
        console.log("success: " + (event.target as IDBRequest).result);
        resolve(store);
      };

      updateReqeusst.onerror = (event) => {
        reject("error: " + (event.target as IDBRequest).error?.message);
      };
    });
  }

  async delete(objectStoreName: string, key: number) {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore({
        mode: "readwrite",
        objectStoreName,
      });

      if (!store) {
        reject("empty store!");
        return;
      }

      const deleteRequest = store.delete(key);

      deleteRequest.onsuccess = (event) => {
        console.log("success: " + (event.target as IDBRequest).result);
        resolve(store);
      };

      deleteRequest.onerror = (event) => {
        reject("error: " + (event.target as IDBRequest).error?.message);
      };
    });
  }

  // cursor, index ... 등등 필요에 따라 추가
}
