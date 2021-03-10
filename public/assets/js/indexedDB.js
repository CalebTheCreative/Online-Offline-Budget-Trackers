let db;
const request = indexedDB.open("budget_db", 1);

// Creates object store("pending")
request.onupgradeneeded = function(evt){
    const db = evt.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

// Checks if onlune
request.onsuccess = function(evt) {
    db = evt.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

// Reports any errors in the console.log
request.onerror = function (evt) {
    console.log("ISSUE! " + evt.target.errorCode);
};

// Saves when offline
function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);    
};


