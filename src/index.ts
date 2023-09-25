import { IndexedDB } from "./indexed_db";

// 초기 indexedDB 설정
const DB_NAME = "testDB";
const DB_VERSION = 1;
const OBJECT_STORE_NAME = "user";

const createObjectStroeIndex = (db: IDBDatabase) => {
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
const createEvent = async () => {
  const itemList = document.querySelector(".itemList");

  if (!(itemList instanceof HTMLUListElement)) return;

  const addValue = {
    name: prompt("what is your name?") || "",
    phone: prompt("what is your phoneNum?") || "",
    email: prompt("what is your email?") || "",
  };

  try {
    await indexedDB.add(OBJECT_STORE_NAME, addValue);

    const data = (await indexedDB.getAll(OBJECT_STORE_NAME)) as any[];

    itemList.replaceChildren();

    data.forEach((el: any) => {
      const item = document.createElement("li");

      item.innerHTML = JSON.stringify(el);
      itemList.appendChild(item);
    });
  } catch (err) {
    console.error(err);
  }
};

// 읽기 이벤트
const readEvent = async () => {
  const itemList = document.querySelector(".itemList");
  const id = Number(prompt("set key"));

  if (!(itemList instanceof HTMLUListElement)) return;

  try {
    const data = (await indexedDB.get(OBJECT_STORE_NAME, id)) as any;

    itemList.replaceChildren();

    const item = document.createElement("li");

    item.innerHTML = JSON.stringify(data);
    itemList.appendChild(item);
  } catch (err) {
    console.error(err);
  }
};

// 전체 읽기 이벤트
const readAllEvent = async () => {
  const itemList = document.querySelector(".itemList");

  if (!(itemList instanceof HTMLUListElement)) return;

  try {
    const data = (await indexedDB.getAll(OBJECT_STORE_NAME)) as any[];

    itemList.replaceChildren();

    data.forEach((el: any) => {
      const item = document.createElement("li");

      item.innerHTML = JSON.stringify(el);
      itemList.appendChild(item);
    });
  } catch (err) {
    console.error(err);
  }
};

// 수정 이벤트
const updateEvent = async () => {
  const itemList = document.querySelector(".itemList");
  const id = Number(prompt("set key"));
  const newValue = {
    name: prompt("what is your name?") || "",
    phone: prompt("what is your phoneNum?") || "",
    email: prompt("what is your email?") || "",
  };

  if (!(itemList instanceof HTMLUListElement)) return;

  try {
    await indexedDB.put(OBJECT_STORE_NAME, newValue, id);

    const data = (await indexedDB.getAll(OBJECT_STORE_NAME)) as any[];

    itemList.replaceChildren();

    data.forEach((el: any) => {
      const item = document.createElement("li");

      item.innerHTML = JSON.stringify(el);
      itemList.appendChild(item);
    });
  } catch (err) {
    console.error(err);
  }
};

// 삭제 이벤트
const deleteEvent = async () => {
  const itemList = document.querySelector(".itemList");
  const id = Number(prompt("set key"));

  if (!(itemList instanceof HTMLUListElement)) return;

  try {
    await indexedDB.delete(OBJECT_STORE_NAME, id);

    const data = (await indexedDB.getAll(OBJECT_STORE_NAME)) as any[];

    itemList.replaceChildren();

    data.forEach((el: any) => {
      const item = document.createElement("li");

      item.innerHTML = JSON.stringify(el);
      itemList.appendChild(item);
    });
  } catch (err) {
    console.error(err);
  }
};

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
