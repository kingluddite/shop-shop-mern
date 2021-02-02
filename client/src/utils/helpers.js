export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return `${name}s`;
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open the connection to the Database `shop-shop` with the version of 1
    const request = window.indexedDB.open("shop-shop", 1);

    // create variables to hold reference to the Database, transaction (tx), and object store
    let db;
    let tx;
    let store;

    // if version has changed (or if this is the first time using the Database)
    // run this method and create the three object stores
    request.onupgradeneeded = function (e) {
      const db = request.result;
      // create object store for each type of data and set "primary" key index
      // to be the `_id` of the data
      db.createObjectStore("products", { keyPath: "_id" });
      db.createObjectStore("categories", { keyPath: "_id" });
      db.createObjectStore("cart", { keyPath: "_id" });
    };

    // handle any errors with connecting
    request.onerror = function (e) {
      console.log("There was an error");
    };

    // on Database open success
    request.onsuccess = function (e) {
      // save a reference of the Database to the `db` variable
      db = request.result;
      // open a transaction do whatever we pass into the `storename`
      // (must match one of the object store names)
      tx = db.transaction(storeName, "readwrite");
      // save a reference to that object store
      store = tx.objectStore(storeName);

      // if there's any errors, let us know
      // eslint-disable-next-line no-shadow
      db.onerror = function (e) {
        console.log("error", e);
      };

      switch (method) {
        case "put":
          store.put(object);
          resolve(object);
          break;
        case "get":
          // eslint-disable-next-line no-case-declarations
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case "delete":
          store.delete(object._id);
          break;
        default:
          console.log("No valid method");
          break;
      }

      // when the transaction is complete, close the connection
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}
