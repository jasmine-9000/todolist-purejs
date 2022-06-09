
const PROTOCOL = "http"
const IP_ADDRESS = "192.168.1.92";
const PORT = 80;
let DEBUG = true;
let VERBOSE = true;

/* Only when the window is loaded do you read the DOM. */

window.addEventListener("load", async () => {
    const dailytaskform = document.getElementById("add_daily_task");
    const generaltaskform = document.getElementById("add_general_task");
    const moveitemsbtn = document.getElementById("movegeneralchecked");
    const togglefinishedbtn = document.getElementById("toggle_finishedtasklist");
    dailytaskform.addEventListener("submit", dailytaskformsubmit);
    generaltaskform.addEventListener("submit", generaltaskformsubmit);
    togglefinishedbtn.addEventListener("click", togglefinishedtaskslist );
    togglefinishedbtn.addEventListener("touchstart", togglefinishedtaskslist );
    moveitemsbtn.addEventListener("click", moveitems);
    let promise = retrievedailytaskspromise().then((data) => {
        if(VERBOSE) {
            console.log("Daily Tasks retrieved from database: ");
            console.table(data);
        }
        displaydailytasks(data);
    });
    let promise2 = retrievegeneraltaskspromise().then((data) => {
        if(VERBOSE) {
            console.log("General Tasks retrieved from database: ");           
            console.table(data);
        }
        displaygeneraltasks(data);
    });
    let promise3 = retrievefinishedtaskspromise().then((data) => {
        if(VERBOSE) {
            console.log("Finished tasks retrieved from database: ");
            console.table(data);
        }
        displayfinishedtasks(data);
    })

})


/**
 * 
 * @param {JSONObject} task Task to be posted
 * @returns A fetch promise. Does not handle .then(). 
 */
function postnewdailytask(task) {
    const address = `${PROTOCOL}://${IP_ADDRESS}:${PORT}/db/dailytasks`;
    const headers = {   'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': IP_ADDRESS};
    if(DEBUG) {
        console.log("Attempting to POST data to db/dailytasks...")
        console.log("Address connecting to: ");
        console.log(address);
        console.log("Headers Used: ");
        console.table(headers);
        console.log("Method: POST");
        console.log("Data being attempted to POST: ");
        console.log(JSON.stringify(task));
    }
    const response = fetch( address, 
                            {
                                method: 'POST', 
                                headers: headers,
                                body: JSON.stringify(task)
                            });
                            return response;
}

/**
 * 
 * @param {JSONObject} task Task to be posted. Must be in form 
 *  { "name": name, "date": date} 
 * @returns A fetch promise. Does not handle .then().
 */
function postnewgeneraltask(task) {
    const address = `${PROTOCOL}://${IP_ADDRESS}:${PORT}/db/generaltasks`;
    const headers = {'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': IP_ADDRESS};
    if(DEBUG) {
        console.log("Attempting to POST data to db/generaltasks...")
        console.log("Address connecting to: ");
        console.log(address);
        console.log("Headers Used: ");
        console.table(headers);
        console.log("Method: POST")
        console.log("Data being attempted to POST: ");
        console.log(JSON.stringify(task));
    }
    const response = fetch(address,
                            {
                                method: 'POST', 
                                headers: headers,
                                body: JSON.stringify(task)
                            });
                            return response;
}
/**
 * 
 * @param {string} name 
 * @param {string} date 
 */

function postnewfinishedtask(name, date) {
    const task = {"name": name,
                "date": date}
    const headers = {'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': IP_ADDRESS};
    const address = `${PROTOCOL}://${IP_ADDRESS}:${PORT}/db/finishedtasks`;
    if(DEBUG) {
        console.log("Attempting to POST data to db/generaltasks...")
        console.log("Address connecting to: ");
        console.log(address);
        console.log("Headers Used: ");
        console.table(headers);
        console.log("Method: POST")
        console.log("Data being attempted to POST: ");
        console.log(JSON.stringify(task));
    }

    fetch(address, 
    {    
        method: 'POST', 
        headers: headers,
        body: JSON.stringify(task)
    });
    
}

/**
 * 
 * @returns promise to return data. use .then() to retreive data and use it. 
 */

async function retrievedailytaskspromise() {
    const data = fetch(`${PROTOCOL}://${IP_ADDRESS}:${PORT}/db/dailytasks`)
                    .then(response => {
                        if(response.ok) {
                            return response.json()
                        } else {
                            console.error("Something went wrong fetching daily tasks");
                            console.error(response.status + ": " + response.statusText);
                            return {};
                        }
                    });
                    return data;
}

/**
 * 
 * @returns A promise to retreive all general tasks. 
 */
async function retrievegeneraltaskspromise() {
    const data = fetch(`${PROTOCOL}://${IP_ADDRESS}:${PORT}/db/generaltasks`)
                    .then(response => {
                        if(response.ok) {
                            return response.json();
                        } else {
                            console.error("Something went wrong fetching general tasks...")
                            return {}
                        }
                    });
                    return data;
}

/**
 * Makes a promise to retrieve a list of finished tasks to display to the DOM.  
 * @returns A promise to retrieve all finished tasks. Use .then() to retrieve data. 
 */
async function retrievefinishedtaskspromise() {
    const data = fetch(`${PROTOCOL}://${IP_ADDRESS}:${PORT}/db/finishedtasks`)
                    .then(response => {
                        if(response.ok) {
                            return response.json();
                        } else {
                            console.error("Something went wrong fetching general tasks...")
                            return {}
                        }
                    });
                    return data;
}

/**
 * Display daily tasks from list.
 * @param {Array<Object>} dailytaskslist An Array of JSON Objects (tasks) to display to the daily todo list. Each object must look like this: {"name": name, "date": date}.
 *
 */
function displaydailytasks(dailytaskslist) {
    const dailylistelem = document.getElementById("daily_todolist");
    const keys = Object.keys(dailytaskslist);
    if(DEBUG) {
        console.log("%cKeys Retrieved in displaydailytasks():", "color: red;")
        console.log(keys);
    }
    keys.forEach((key) => {
        addtasktolistDOM(`${key}: ${dailytaskslist[key]}`, dailylistelem)
    })
}

/**
 * Displays general tasks from list object.
 * @param {Array<Object>} taskslist An Array of JSON Objects (tasks) to display to general todolist. Each object must look like this: {"name": name, "date": date}.
 */
function displaygeneraltasks(taskslist) {
    const listelem = document.getElementById("general_todolist");
    const keys = Object.keys(taskslist);
    if(DEBUG) {
        console.log("%cKeys retrieved in displaygeneraltasks():", "color: red;")
        console.log(keys);
    }
    keys.forEach((key, index) => {
        addtasktolistDOM(`${key}: ${taskslist[key]}`, listelem)
    })
}


/**
 * Displays a list of objects to finished tasks. 
 * @param {Array<Object>} taskslist An array of JSON objects. Each object must look like this: {"name": name, "date": date}.
 */
function displayfinishedtasks(taskslist) {
    const listelem = document.getElementById("finished_tasklist");
    const keys = Object.keys(taskslist);
    if(DEBUG) {
        console.log("%cKeys Retrieved in displayfinishedtasks():", "color:red;")
        console.log(keys);
    }
    keys.forEach((key, index) => {
        addfinishedtasktolistDOM(`${key}: ${taskslist[key]}`, listelem)
    })
}

/**
 * meow
 * @returns 
 */
function moveitems() {
    const todolist = document.getElementById("general_todolist");
    //  const items = todolist.querySelectorAll("input[type=checkbox]");
    if(DEBUG) {
        console.log("%cMove items button clicked:", "color: pink; font-weight: 700;");
    }
    if(VERBOSE) {
        console.log(todolist.children);
    }
    [...todolist.children].forEach((liElement, index) => {
        
        let checked = liElement.querySelector("input[type=checkbox]").checked;
        if(DEBUG) {
            console.log(liElement);
            console.log(index);
            console.log(todolist.children[index]);
            console.log(checked);
        }
        if(checked) {
            let text = liElement.textContent;
            let txtarr = text.split(": ");
            let name = txtarr[0];
            let date = txtarr[1];
            let task = {name: name, date: date}
            if(DEBUG) {
                console.log("Checked item found. Task: ");
                console.table(task);
            }
            // remove element from table
            todolist.removeChild(liElement);
            // add new element to finished tasks
            addtasktofinished(task);
            // post it to finished tasks database
            postnewfinishedtask(name, date);
            // remove element from general tasks to do.
            removeElementFromGeneralServer(name, date);
        }


    })
    /*
    [...items].forEach((element, index) => {
        if(VERBOSE) {
            console.log("Element iterated through: ");
            console.log(element);
            console.log("Index Iterated Through: ",index);
        }
        if(element.checked) {
            let liElem = todolist.children[index];
            let text = liElem.textContent;
            let txtarr = text.split(": ");
            let name = txtarr[0];
            let date = txtarr[1];
            if(VERBOSE) {
                console.log("move items 2");
                console.log(name, date);
            }
            addElementToFinished(liElem);
            postnewfinishedtask(name, date);
            // removeElementFromGeneral(liElem);
            removeElementFromGeneralServer(name, date);
        }
    });
    */
    return;
}

function addtasktofinished(task) {
    let taskAsString = task.name + ': ' + task.date;
    let textNode = document.createTextNode(taskAsString);
    let taskLi = document.createElement('li');
    taskLi.appendChild(textNode);
    document.getElementById("finished_tasklist").appendChild(taskLi);
}

function addElementToFinished(element) {
    // remove label and checkbox from element
    console.log(element.querySelector('label'));
    element.removeChild(element.querySelector('label'))
    document.getElementById("finished_tasklist").appendChild(element);
}


function removeElementFromGeneralServer(name, date) {
    // remove label and checkbox from element
    let task = {"name": name,
                "date": date}
    const headers = {'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': IP_ADDRESS};
    const address = `${PROTOCOL}://${IP_ADDRESS}:${PORT}/db/generaltasks`;
    if(DEBUG) {
        console.log("Attempting to delete item from database...");
        console.log("Address connecting to: ");
        console.log(address);
        console.log("Headers Used: ");
        console.table(headers);
        console.log("Method: DELETE")
        console.log("Data being attempted to DELETE: ");
        console.log(JSON.stringify(task));
    }
    fetch(  address, 
            {    
                method: 'DELETE', 
                headers: headers,
                body: JSON.stringify(task)
            });
    
}

/**
 * Adds a task item to a element with the custom checkmark.
 * 
 * @param {string} taskAsString What do you want to display it to?
 * @param {HTMLElement} element Which list to render it to  
 * @param {boolean} checked Has the element been checked already?
 */
function addtasktolistDOM(taskAsString, element,checked=false) {
    let task = document.createElement('li' );

    /*
        Tries to render this HTML output:
            <label class='container1'><input type='checkbox'><span class='checkmark'></span></label>
    */
    let checkboxcont = document.createElement('label');
    let checkbox = document.createElement('input')
    let checkmark = document.createElement('span');
    checkmark.setAttribute('class', 'checkmark')
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = checked;
    checkboxcont.setAttribute('class', 'container1');
    checkboxcont.appendChild(checkbox);
    checkboxcont.appendChild(checkmark);

    task.appendChild(checkboxcont);
    task.appendChild(document.createTextNode(taskAsString));
    element.appendChild(task);
}
function addfinishedtasktolistDOM(taskAsString, element) {
    let task = document.createElement('li' );
    task.appendChild(document.createTextNode(taskAsString));
    element.appendChild(task);
}



function dailytaskformsubmit(e) {
    e.preventDefault();
    const name = document.getElementById("newdailytaskname").value;
    const date = document.getElementById("newdailytaskdate").value;
    const newtask = {"task": {name: name, date: date}}
    if(DEBUG) {
        console.log("New Daily Task Created: ");
        console.table(newtask);
    }
    addtasktolistDOM(`${name}: ${date}`, document.getElementById('daily_todolist'))
    postnewdailytask(newtask).then(response => response.json())
        .then(data => {
            console.log(data);
        });
}
function generaltaskformsubmit(e) {
    e.preventDefault();
    const name = document.getElementById("newgeneraltaskname").value;
    const date = document.getElementById("newgeneraltaskdate").value;
    const newtask = {"name": name, "date": date}
    addtasktolistDOM(`${name}: ${date}`, document.getElementById('general_todolist'))
    postnewgeneraltask(newtask).then(response => response.json())
        .then(data => {
            console.log(data);
        });
}

function togglefinishedtaskslist() {
    document.getElementById("finishedtasklist_container").classList.toggle("hidden");
}



// from MDN docs
function retrieveImage(url) {
    const img = document.querySelector('img');
    const req  =new Request('flowers.jpg');
    fetch(req).then(response => {
        console.log(response.status);
        response.blob().then(myBlob => {
            const objectURL = URL.createObjectURL(myBlob);
            img.src = objectURL;
        })
    })
}


