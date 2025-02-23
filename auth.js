function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function findUser(email, password) {
    let users = getUsers();
    return users.find(user => user.email === email && user.password === password);
}
