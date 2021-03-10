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

// Checks for any changes made when offline and stores in server
function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            });
        }
    };
}

// Checks for when the app is back online again
window.addEventListener("online", checkDatabase);