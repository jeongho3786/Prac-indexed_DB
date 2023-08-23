interface GetObjectStoreParams {
  objectStoreName: string;
  mode: IDBTransactionMode;
}

class IndexedDB {
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
    if (!window.indexedDB) {
      window.alert(
        "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
      );
      return;
    }

    this.dbVersion = dbVersion;

    const DBRequest = indexedDB.open(this.dbName, this.dbVersion);

    DBRequest.onsuccess = (event) => {
      this.db = (event.target as IDBRequest).result;
      console.log(
        `Successfully opened DB, name: ${this.dbName}, version: ${this.dbVersion}`
      );
    };

    DBRequest.onerror = (event) => {
      console.error("error: " + (event.target as IDBRequest).error?.message);
    };

    DBRequest.onupgradeneeded = (_) => {
      if (!this.db) {
        console.error("error: empty DB");
        return;
      }

      if (!controlObjectStore) return;

      controlObjectStore(this.db);
    };
  }

  add(objectStoreName: string, addData: { [key: string]: any }) {
    const store = this.getObjectStore({
      mode: "readwrite",
      objectStoreName,
    });

    if (!store) return;

    const addRequest = store.add(addData);

    addRequest.onsuccess = (event) => {
      console.log("success: " + (event.target as IDBRequest).result);
    };

    addRequest.onerror = (event) => {
      console.error("error: " + (event.target as IDBRequest).error?.message);
    };
  }

  get(objectStoreName: string, key: number) {
    let result: any = null;

    const store = this.getObjectStore({
      mode: "readonly",
      objectStoreName,
    });

    if (!store) return;

    const getRequest = store.get(key);

    getRequest.onsuccess = (event) => {
      result = (event.target as IDBRequest).result;
    };

    getRequest.onerror = (event) => {
      console.error("error: " + (event.target as IDBRequest).error?.message);
    };

    return result;
  }

  getAll(objectStoreName: string) {
    let result: any[] = [];

    const store = this.getObjectStore({
      mode: "readonly",
      objectStoreName,
    });

    if (!store) return;

    const getRequest = store.getAll();

    getRequest.onsuccess = (event) => {
      result = (event.target as IDBRequest<any[]>).result;
    };

    getRequest.onerror = (event) => {
      console.error("error: " + (event.target as IDBRequest).error?.message);
    };

    return result;
  }

  put(objectStoreName: string, putData: { [key: string]: any }, key: number) {
    const store = this.getObjectStore({
      mode: "readwrite",
      objectStoreName,
    });

    if (!store) return;

    const updateReqeusst = store.put(putData, key);

    updateReqeusst.onsuccess = (event) => {
      console.log("success: " + (event.target as IDBRequest).result);
    };

    updateReqeusst.onerror = (event) => {
      console.log("error: " + (event.target as IDBRequest).error?.message);
    };
  }

  delete(objectStoreName: string, key: number) {
    const store = this.getObjectStore({
      mode: "readwrite",
      objectStoreName,
    });

    if (!store) return;

    const deleteRequest = store.delete(key);

    deleteRequest.onsuccess = (event) => {
      console.log("success: " + (event.target as IDBRequest).result);
    };

    deleteRequest.onerror = (event) => {
      console.log("error: " + (event.target as IDBRequest).error?.message);
    };
  }
}

export default IndexedDB;
