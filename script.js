window.addEventListener("load", () => {
    const form = document.getElementById("add_daily_task");
    form.addEventListener("submit", dailytaskformsubmit);


    
})

const IPaddress = "192.168.1.92";
const PORT = 80;

function postnewtask(task) {
    const response = fetch(`http://${IPaddress}:${PORT}/db/dailytasks`, 
                            {
                                method: 'POST', 
                                headers: {'Content-Type': 'application/json',
                                          'Access-Control-Allow-Origin': IPaddress},
                                body: JSON.stringify(task)
                            });
                            return response;
}

function dailytaskformsubmit(e) {
    e.preventDefault();
    const name = document.getElementById("newdailytaskname").value;
    const date = document.getElementById("newdailytaskdate").value;
    const newtask = {"task": {name: name, date: date}}
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