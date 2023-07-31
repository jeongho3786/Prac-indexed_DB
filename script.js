// 초기 indexedDB 설정
const dbName = "testDB";
const objectStoreName = "user";
const dbRequest = indexedDB.open("dbName", 1);
let db = null;

dbRequest.onsuccess = (event) => {
  db = event.target.result;
  console.log("success db conect");
};

dbRequest.onerror = (event) => {
  console.log("error: " + event.target.errorCode);
};

dbRequest.onupgradeneeded = (event) => {
  if (!db) {
    db = event.target.result;
  }

  const objectStore = db.createObjectStore(objectStoreName, {
    autoIncrement: true,
  });
  objectStore.createIndex("name", "name");
  objectStore.createIndex("phone", "phone");
  objectStore.createIndex("email", "email");
};

// 생성 이벤트
const createEvent = () => {
  if (!db) {
    console.log("DB does not exist");
    return;
  }

  const transaction = db.transaction(objectStoreName, "readwrite");

  transaction.oncomplete = (_) => {
    console.log("Transaction completed: database modification finished");
  };

  transaction.onerror = (event) => {
    console.log(
      "Transaction not opened due to error: " + event.target.errorCode
    );
  };

  const store = transaction.objectStore(objectStoreName);
  const addRequest = store.add({
    name: prompt("what is your name?"),
    phone: prompt("what is your phoneNum?"),
    email: prompt("what is your email?"),
  });

  addRequest.onsuccess = (event) => {
    console.log("success: " + event.target.result);
  };

  addRequest.onerror = (event) => {
    console.log("error: " + event.target.errorCode);
  };
};

// 읽기 이벤트
const readEvent = () => {
  if (!db) {
    console.log("DB does not exist");
    return;
  }

  const itemList = document.querySelector(".itemList");
  const id = Number(prompt("set key"));

  // 트랜잭션 완료 및 에러 핸들러 생략
  const store = db
    .transaction(objectStoreName, "readonly")
    .objectStore(objectStoreName);

  const getRequest = store.get(id);

  getRequest.onsuccess = (event) => {
    itemList.replaceChildren();

    const item = document.createElement("li");

    item.innerHTML = JSON.stringify(event.target.result);
    itemList.appendChild(item);
  };

  getRequest.onerror = (event) => {
    console.log("error: " + event.target.errorCode);
  };
};

// 전체 읽기 이벤트
const readAllEvent = () => {
  if (!db) {
    console.log("DB does not exist");
    return;
  }

  const itemList = document.querySelector(".itemList");

  const store = db
    .transaction(objectStoreName, "readonly")
    .objectStore(objectStoreName);

  const getRequest = store.getAll();

  getRequest.onsuccess = (event) => {
    itemList.replaceChildren();

    event.target.result.forEach((el) => {
      const item = document.createElement("li");

      item.innerHTML = JSON.stringify(el);
      itemList.appendChild(item);
    });
  };

  getRequest.onerror = (event) => {
    console.log("error: " + event.target.errorCode);
  };
};

// 수정 이벤트
const updateEvent = () => {
  if (!db) {
    console.log("DB does not exist");
    return;
  }

  const itemList = document.querySelector(".itemList");
  const id = Number(prompt("set key"));

  const store = db
    .transaction(objectStoreName, "readwrite")
    .objectStore(objectStoreName);

  const updateReqeusst = store.put(
    {
      name: prompt("what is your name?"),
      phone: prompt("what is your phoneNum?"),
      email: prompt("what is your email?"),
    },
    id
  );

  updateReqeusst.onsuccess = (_) => {
    const getRequest = store.getAll();

    getRequest.onsuccess = (event) => {
      itemList.replaceChildren();

      event.target.result.forEach((el) => {
        const item = document.createElement("li");

        item.innerHTML = JSON.stringify(el);
        itemList.appendChild(item);
      });
    };

    getRequest.onerror = (event) => {
      console.log("error: " + event.target.errorCode);
    };
  };

  updateReqeusst.onerror = (event) => {
    console.log("error: " + event.target.errorCode);
  };
};

// 삭제 이벤트
const deleteEvent = () => {
  if (!db) {
    console.log("DB does not exist");
    return;
  }

  const itemList = document.querySelector(".itemList");
  const id = Number(prompt("set key"));

  const store = db
    .transaction(objectStoreName, "readwrite")
    .objectStore(objectStoreName);

  const deleteRequest = store.delete(id);

  deleteRequest.onsuccess = (_) => {
    const getRequest = store.getAll();

    getRequest.onsuccess = (event) => {
      itemList.replaceChildren();

      event.target.result.forEach((el) => {
        const item = document.createElement("li");

        item.innerHTML = JSON.stringify(el);
        itemList.appendChild(item);
      });
    };

    getRequest.onerror = (event) => {
      console.log("error: " + event.target.errorCode);
    };
  };

  deleteRequest.onerror = (event) => {
    console.log("error: " + event.target.errorCode);
  };
};

// 초기화 이벤트 (이벤트 연결)
const init = () => {
  if (!window.indexedDB) {
    window.alert(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );

    return;
  }

  const createButton = document.querySelector("#createButton");
  const readButton = document.querySelector("#readButton");
  const readAllButton = document.querySelector("#readAllButton");
  const updateButton = document.querySelector("#updateButton");
  const deletebutton = document.querySelector("#deleteButton");

  createButton.onclick = createEvent;
  readButton.onclick = readEvent;
  readAllButton.onclick = readAllEvent;
  updateButton.onclick = updateEvent;
  deletebutton.onclick = deleteEvent;
};

init();
