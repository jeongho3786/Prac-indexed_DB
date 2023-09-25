var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class IndexedDB {
    constructor(dbName) {
        this.db = null;
        this.dbVersion = null;
        this.db;
        this.dbName = dbName;
        this.dbVersion;
    }
    getObjectStore({ mode, objectStoreName, }) {
        if (!this.db) {
            console.error("error: empty DB");
            return null;
        }
        const transaction = this.db.transaction(objectStoreName, mode);
        transaction.oncomplete = (_) => {
            console.log("Transaction completed: database modification finished");
        };
        transaction.onerror = (event) => {
            var _a;
            console.error("Transaction not opened due to error: " +
                ((_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message));
        };
        return transaction.objectStore(objectStoreName);
    }
    open(dbVersion, controlObjectStore) {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
                reject();
                return;
            }
            this.dbVersion = dbVersion;
            const DBRequest = indexedDB.open(this.dbName, this.dbVersion);
            DBRequest.onsuccess = (_) => {
                this.db = DBRequest.result;
                console.log(`Successfully opened DB, name: ${this.dbName}, version: ${this.dbVersion}`);
                resolve(this.db);
            };
            DBRequest.onerror = (event) => {
                var _a;
                console.error("error: " + ((_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message));
                reject();
            };
            DBRequest.onupgradeneeded = (event) => {
                this.db = event.target.result;
                if (!this.db) {
                    console.error("error: empty DB");
                    return;
                }
                if (!controlObjectStore)
                    return;
                controlObjectStore(this.db);
                resolve(this.db);
            };
        });
    }
    add(objectStoreName, addData) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    console.log("success: " + event.target.result);
                    resolve(store);
                };
                addRequest.onerror = (event) => {
                    var _a;
                    reject("error: " + ((_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message));
                };
            });
        });
    }
    get(objectStoreName, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
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
                    result = event.target.result;
                    if (!result) {
                        reject("have't value");
                    }
                    resolve(result);
                };
                getRequest.onerror = (event) => {
                    var _a;
                    reject("error: " + ((_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message));
                };
            });
        });
    }
    getAll(objectStoreName) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
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
                    result = event.target.result;
                    resolve(result);
                };
                getRequest.onerror = (event) => {
                    var _a;
                    reject("error: " + ((_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message));
                };
            });
        });
    }
    put(objectStoreName, putData, key) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    console.log("success: " + event.target.result);
                    resolve(store);
                };
                updateReqeusst.onerror = (event) => {
                    var _a;
                    reject("error: " + ((_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message));
                };
            });
        });
    }
    delete(objectStoreName, key) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    console.log("success: " + event.target.result);
                    resolve(store);
                };
                deleteRequest.onerror = (event) => {
                    var _a;
                    reject("error: " + ((_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message));
                };
            });
        });
    }
}
