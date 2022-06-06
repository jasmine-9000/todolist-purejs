window.addEventListener("load", async () => {
    const form = document.getElementById("add_daily_task");
    form.addEventListener("submit", dailytaskformsubmit);
    let promise = retrievedailytaskspromise().then((data) => {
        console.log(data);
        displaydailytasks(data);
    });

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

function addtasktolistDOM(taskAsString, element) {
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