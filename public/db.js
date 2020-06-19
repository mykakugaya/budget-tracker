window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
const request = window.indexedDB.open("offline", 1);
      let db,
        tx,
        store;
  
      request.onupgradeneeded = function(e) {
        const db = request.result;
        db.createObjectStore("pending", {autoIncrement: true });
      };
  
      request.onerror = function(e) {
        console.log("There was an error");
      };

      request.onsuccess = ({target}) => db = target.result;

  const saveRecord = data =>{
      console.log(data)
    const trans = db.transaction("pending", "readwrite");
    const store = trans.objectStore("pending")
    store.add(data)
  }
  
  const loadDB = () =>{
      console.log("Retrieving offline data..")
    const trans = db.transaction("pending", "readwrite");
    const store = trans.objectStore("pending");
    const cached = store.getAll();

    cached.onsuccess = function(){
        cached.result.length ? fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(cached.result),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        }).then(res=>{
            const trans = db.transaction("pending", "readwrite");
            const store = trans.objectStore("pending");
            console.log('Records updated!')
            store.clear()
        }).catch(err=> console.log(err))
         : console.log("No stored offline transactions!")
    }
  }

  window.addEventListener("online", loadDB);
  window.addEventListener('load', loadDB);