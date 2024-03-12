document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (validateCredentials(username, password)) {
            localStorage.setItem('loggedInUser', JSON.stringify({ username: username }));
            window.location.href = "index.html";
        } else {
            alert('Invalid username or password');
        }
    });
});

function validateCredentials(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.username === username && user.password === password);
}
