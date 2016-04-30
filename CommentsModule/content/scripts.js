(function () {
    'use strict';

    var loginForm = document.getElementById('login-form'),
        registerForm = document.getElementById('register-form'),
        logoutBtn = document.getElementById('logout'),
        closeBtn = document.getElementById('close-btn');

    if (loginForm && registerForm) {
        document.getElementById('register').addEventListener('click', function () {
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        });

        document.getElementById('login').addEventListener('click', function () {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            this.parentNode.submit();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            this.parentNode.parentNode.removeChild(this.parentNode);
        })
    }
})();
