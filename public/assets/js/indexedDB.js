let db;
const request = indexedDB.open("budget_DB", 1);

// Creates object store("pending")
request.onupgradeneeded = function(evt){
    const db = evt.request.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

