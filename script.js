window.addEventListener("load", async () => {
    const form = document.getElementById("add_daily_task");
    const moveitemsbtn = document.getElementById("movegeneralchecked");
    form.addEventListener("submit", dailytaskformsubmit);
    moveitemsbtn.addEventListener("click", moveitems);
    let promise = retrievedailytaskspromise().then((data) => {
        console.log(data);
        displaydailytasks(data);
    });
    let promise2 = retrievegeneraltaskspromise().then((data) => {
        console.log(data);
        displaygeneraltasks(data);
    });
    let promise3 = retrievefinishedtaskspromise().then((data) => {
        console.log(data);
        displayfinishedtasks(data);
    })

})

const PROTOCOL = "http"
const IP_ADDRESS = "192.168.1.92";
const PORT = 80;

function postnewtask(task) {
    const response = fetch(`${PROTOCOL}://${IP_ADDRESS}:${PORT}/db/dailytasks`, 
                            {
                                method: 'POST', 
                                headers: {'Content-Type': 'application/json',
                                          'Access-Control-Allow-Origin': IP_ADDRESS},
                                body: JSON.stringify(task)
                            });
                            return response;
}

async function retrievedailytaskspromise() {
    const data = fetch(`${PROTOCOL}://${IP_ADDRESS}:${PORT}/db/dailytasks`)
                    .then(response => {
                        if(response.ok) {
                            return response.json()
                        } else {
                            console.error("Something went wrong fetching daily tasks");
                            return {};
                        }
                    });
                    return data;
                    
}
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

function displaydailytasks(dailytaskslist) {
    const dailylistelem = document.getElementById("daily_todolist");
    const keys = Object.keys(dailytaskslist);
    console.log(keys);
    keys.forEach((key, index) => {
        addtasktolistDOM(`${key}: ${dailytaskslist[key]}`, dailylistelem)
        /*
        let dailytask = document.createElement('li' );
        dailytask.appendChild(document.createTextNode(`${dailytaskslist[key]}: ${key}`));
        dailylistelem.appendChild(dailytask);
        */
    })
}
function displaygeneraltasks(taskslist) {
    const listelem = document.getElementById("general_todolist");
    const keys = Object.keys(taskslist);
    console.log(keys);
    keys.forEach((key, index) => {
        addtasktolistDOM(`${key}: ${taskslist[key]}`, listelem)
        /*
        let dailytask = document.createElement('li' );
        dailytask.appendChild(document.createTextNode(`${dailytaskslist[key]}: ${key}`));
        dailylistelem.appendChild(dailytask);
        */
    })
}

function displayfinishedtasks(taskslist) {
    const listelem = document.getElementById("finished_tasklist");
    const keys = Object.keys(taskslist);
    console.log(keys);
    keys.forEach((key, index) => {
        addfinishedtasktolistDOM(`${key}: ${taskslist[key]}`, listelem)
        /*
        let dailytask = document.createElement('li' );
        dailytask.appendChild(document.createTextNode(`${dailytaskslist[key]}: ${key}`));
        dailylistelem.appendChild(dailytask);
        */
    })
}
function moveitems() {
    const todolist = document.getElementById("general_todolist");
    const items = todolist.querySelectorAll("input[type=checkbox");
    console.log("move items button:");
    console.log(items);
    [...items].forEach((element, index) => {
        if(element.checked) {
            let liElem = todolist.children[index];
            let text = liElem.textContent;
            let txtarr = text.split(": ");
            let name = txtarr[0];
            let date = txtarr[1];
            console.log("move items 2");
            console.log(name, date);
            addElementToFinished(liElem);
            addElementToFinishedServer(name, date);
            removeElementFromGeneral(liElem);
            removeElementFromGeneralServer(name, date);
        }
    });
}

function removeElementFromGeneral(element) {
    

}

function addElementToFinished(element) {
    // remove label and checkbox from element
    console.log(element.querySelector('label'));
    element.removeChild(element.querySelector('label'))
    document.getElementById("finished_tasklist").appendChild(element);
}

function addElementToFinishedServer(name, date) {
    let task = {"name": name,
                "date": date}
    fetch(`${PROTOCOL}://${IP_ADDRESS}:${PORT}/db/finishedtasks`, 
                            {    
                                method: 'POST', 
                                headers: {'Content-Type': 'application/json',
                                        'Access-Control-Allow-Origin': IP_ADDRESS},
                                body: JSON.stringify(task)
                            });
    console.log(task);
}

function removeElementFromGeneralServer(name, date) {
    // remove label and checkbox from element
    let task = {"name": name,
                "date": date}
    fetch(`${PROTOCOL}://${IP_ADDRESS}:${PORT}/db/generaltasks`, 
                            {    
                                method: 'DELETE', 
                                headers: {'Content-Type': 'application/json',
                                        'Access-Control-Allow-Origin': IP_ADDRESS},
                                body: JSON.stringify(task)
                            });
    console.log(task);
}


function addtasktolistDOM(taskAsString, element,checked=false) {
    let task = document.createElement('li' );

    // let samplecheckboxstr = "<label class='container1'><input type='checkbox'><span class='checkmark'></span></label>"
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
    addtasktolistDOM(`${name}: ${date}`, document.getElementById('daily_todolist'))
    postnewtask(newtask).then(response => response.json())
        .then(data => {
            console.log(data);
        });
}

/*
function login() {
    const types = {
        "ROCK": 1,
        "PAPER": 2,
        "SCISSORS": 3
    }
    const response = fetch('http://localhost:80/login', {
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json',
                              'Content-Length': JSON.stringify(types).length},
                    body: JSON.stringify(types)
                });
                return response;
} */