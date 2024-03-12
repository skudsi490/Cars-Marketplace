document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (validateRegistration(username, password, confirmPassword)) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.username === username)) {
                alert('Username already exists. Please choose another one.');
                return;
            }

            users.push({ username: username, password: password });
            localStorage.setItem('users', JSON.stringify(users));

            window.location.href = "login.html";
        } else {
            alert('Registration failed. Please ensure all fields are filled correctly.');
        }
    });
});

function validateRegistration(username, password, confirmPassword) {
    return username !== '' && password !== '' && password === confirmPassword;
}
