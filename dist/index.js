var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { IndexedDB } from "./indexed_db.js";
// 초기 indexedDB 설정
const DB_NAME = "testDB";
const DB_VERSION = 1;
const OBJECT_STORE_NAME = "user";
const createObjectStroeIndex = (db) => {
  const objectStore = db.createObjectStore(OBJECT_STORE_NAME, {
    autoIncrement: true,
  });
  objectStore.createIndex("name", "name");
  objectStore.createIndex("phone", "phone");
  objectStore.createIndex("email", "email");
};
const indexedDB = new IndexedDB(DB_NAME);
indexedDB.open(DB_VERSION, createObjectStroeIndex);
// 생성 이벤트
const createEvent = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const itemList = document.querySelector(".itemList");
    if (!(itemList instanceof HTMLUListElement)) return;
    const addValue = {
      name: prompt("what is your name?") || "",
      phone: prompt("what is your phoneNum?") || "",
      email: prompt("what is your email?") || "",
    };
    try {
      yield indexedDB.add(OBJECT_STORE_NAME, addValue);
      const data = yield indexedDB.getAll(OBJECT_STORE_NAME);
      itemList.replaceChildren();
      data.forEach((el) => {
        const item = document.createElement("li");
        item.innerHTML = JSON.stringify(el);
        itemList.appendChild(item);
      });
    } catch (err) {
      console.error(err);
    }
  });
// 읽기 이벤트
const readEvent = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const itemList = document.querySelector(".itemList");
    const id = Number(prompt("set key"));
    if (!(itemList instanceof HTMLUListElement)) return;
    try {
      const data = yield indexedDB.get(OBJECT_STORE_NAME, id);
      itemList.replaceChildren();
      const item = document.createElement("li");
      item.innerHTML = JSON.stringify(data);
      itemList.appendChild(item);
    } catch (err) {
      console.error(err);
    }
  });
// 전체 읽기 이벤트
const readAllEvent = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const itemList = document.querySelector(".itemList");
    if (!(itemList instanceof HTMLUListElement)) return;
    try {
      const data = yield indexedDB.getAll(OBJECT_STORE_NAME);
      itemList.replaceChildren();
      data.forEach((el) => {
        const item = document.createElement("li");
        item.innerHTML = JSON.stringify(el);
        itemList.appendChild(item);
      });
    } catch (err) {
      console.error(err);
    }
  });
// 수정 이벤트
const updateEvent = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const itemList = document.querySelector(".itemList");
    const id = Number(prompt("set key"));
    const newValue = {
      name: prompt("what is your name?") || "",
      phone: prompt("what is your phoneNum?") || "",
      email: prompt("what is your email?") || "",
    };
    if (!(itemList instanceof HTMLUListElement)) return;
    try {
      yield indexedDB.put(OBJECT_STORE_NAME, newValue, id);
      const data = yield indexedDB.getAll(OBJECT_STORE_NAME);
      itemList.replaceChildren();
      data.forEach((el) => {
        const item = document.createElement("li");
        item.innerHTML = JSON.stringify(el);
        itemList.appendChild(item);
      });
    } catch (err) {
      console.error(err);
    }
  });
// 삭제 이벤트
const deleteEvent = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const itemList = document.querySelector(".itemList");
    const id = Number(prompt("set key"));
    if (!(itemList instanceof HTMLUListElement)) return;
    try {
      yield indexedDB.delete(OBJECT_STORE_NAME, id);
      const data = yield indexedDB.getAll(OBJECT_STORE_NAME);
      itemList.replaceChildren();
      data.forEach((el) => {
        const item = document.createElement("li");
        item.innerHTML = JSON.stringify(el);
        itemList.appendChild(item);
      });
    } catch (err) {
      console.error(err);
    }
  });
// 초기화 이벤트 (이벤트 연결)
const init = () => {
  const createButton = document.querySelector("#createButton");
  const readButton = document.querySelector("#readButton");
  const readAllButton = document.querySelector("#readAllButton");
  const updateButton = document.querySelector("#updateButton");
  const deletebutton = document.querySelector("#deleteButton");
  if (
    !(createButton instanceof HTMLButtonElement) ||
    !(readButton instanceof HTMLButtonElement) ||
    !(readAllButton instanceof HTMLButtonElement) ||
    !(updateButton instanceof HTMLButtonElement) ||
    !(deletebutton instanceof HTMLButtonElement)
  ) {
    return;
  }
  createButton.onclick = createEvent;
  readButton.onclick = readEvent;
  readAllButton.onclick = readAllEvent;
  updateButton.onclick = updateEvent;
  deletebutton.onclick = deleteEvent;
};
init();
