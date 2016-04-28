(function () {
    var HEADERS = {
        'X-Parse-Application-Id': 'vfGKFWfUWWHtz4nEk3oAofeqWW3dJiwXka2CpMCN',
        'X-Parse-REST-API-Key': 'psQ12s73IMF00pn5Lbojo0DfpesUqdEswiqmDCaA'
    };

    $(function () {
        $('#status-close').click(closeStatus);
        $('form > a').click(toggleRegisterAndLogin);
        $('#register-btn').click(registerUser);
        $('#login-btn').click(loginUser);
        $('#add-btn').click(addNote);
        $('#notes-container').css('display', 'inline-block').hide();
        if (sessionStorage['user']) {
            login(JSON.parse(sessionStorage['user']));
        }
    });

    function registerUser() {
        $.ajax({
            method: 'POST',
            headers: HEADERS,
            url: 'https://api.parse.com/1/classes/_User',
            data: JSON.stringify({
                'username': $('#username').val(),
                'password': $('#password').val()
            }),
            contentType: 'application/json',
            success: registrationSuccessful,
            error: registrationError
        });
    }

    function registrationSuccessful() {
        $('#status-message').text('User registered successfully.');
        operationSuccessful();
        $('#username, #password').val('');
        toggleRegisterAndLogin();
    }

    function registrationError() {
        $('#status-message').text('Registration error.');
        operationFailed();
    }

    function loginUser() {
        $.ajax({
            method: 'GET',
            headers: HEADERS,
            url: 'https://api.parse.com/1/login?username=' + $('#username').val() + '&password=' + $('#password').val(),
            success: loginSuccessful,
            error: loginError
        })
    }

    function loginSuccessful(data) {
        sessionStorage['user'] = JSON.stringify(data);
        login(data);
        $('#status-message').text('Login successful.');
        operationSuccessful();
    }

    function loginError() {
        $('#status-message').text('Login error. Please try again.');
        operationFailed();
    }

    function login(data) {
        HEADERS['X-Parse-Session-Token'] = data.sessionToken;
        loadNotes();
        $('header > h1')
            .text('Notes - ' + data.username)
            .append($('<a>')
                .attr('href', '#')
                .text('Logout')
                .click(logout));
    }

    function logout() {
        delete HEADERS['X-Parse-Session-Token'];
        delete sessionStorage['user'];
        $('form').show();
        $('#notes-container').hide();
        $('#username, #password').val('');
        $('#status-message').text('Logout successful.');
        operationSuccessful();
    }

    function loadNotes() {
        $.ajax({
            method: 'GET',
            headers: HEADERS,
            url: 'https://api.parse.com/1/classes/Note',
            success: notesLoaded,
            error: notesLoadError
        })
    }

    function notesLoaded(data) {
        $('#notes-container').children().not('#add-note').remove();
        data.results.forEach(function(note) {
            $('#notes-container')
                .append($('<section>')
                    .append($('<strong>')
                        .text(note.title))
                    .append($('<div>')
                        .addClass('delete-btn')
                        .text('X')
                        .data('note', note)
                        .click(deleteNote))
                    .append('<br>')
                    .append($('<span>')
                        .text(note.text)));
        });
        showNotes();
    }

    function notesLoadError() {
        $('#status-message').text('Could not load notes. Please try again.');
        operationFailed();
    }

    function addNote() {
        $.ajax({
            method: 'GET',
            headers: HEADERS,
            url: 'https://api.parse.com/1/users/me',
            success: function (user) {
                $.ajax({
                    method: 'POST',
                    headers: HEADERS,
                    url: 'https://api.parse.com/1/classes/Note',
                    data: JSON.stringify({
                        'title': $('#add-title').val(),
                        'text': $('#add-text').val(),
                        'ACL': JSON.parse('{"' + user.objectId + '": { "write": true, "read": true } }')
                    }),
                    contentType: 'application/json',
                    success: noteAdded,
                    error: addFailed
                });
            }, error: addFailed
        });
    }

    function noteAdded() {
        $('#status-message').text('Note added successfully.');
        $('#add-title, #add-text').val('');
        operationSuccessful();
        loadNotes();
    }

    function addFailed() {
        $('#status-message').text('Could not add note. Please try again.');
        operationFailed();
    }

    function deleteNote() {
        if (confirm('Are you sure you want to delete this note?')) {
            $.ajax({
                method: 'DELETE',
                headers: HEADERS,
                url: 'https://api.parse.com/1/classes/Note/' +  $(this).data('note').objectId,
                success: noteDeleted,
                error: deleteFailed
            });
        }
    }

    function noteDeleted() {
        $('#status-message').text('Note deleted successfully.');
        operationSuccessful();
        loadNotes();
    }

    function deleteFailed() {
        $('#status-message').text('Could not delete note. Please try again.');
        operationFailed();
    }

    function operationSuccessful() {
        $('#status-close').css('border-color', '#5C732F').css('color', '#5C732F');
        $('#status-container')
            .css('background', '#88A945')
            .css('border-color', '#5C732F')
            .show(400)
            .delay(5000)
            .hide(400);
    }

    function operationFailed() {
        $('#status-close').css('border-color', '#C0504D').css('color', '#C0504D');
        $('#status-container')
            .css('background', '#EC795A')
            .css('border-color', '#C0504D')
            .show(400);
    }

    function toggleRegisterAndLogin() {
        $('form').children('h1, button, a').toggle();
        $('#username, #password').val('');
    }

    function showNotes() {
        $('form').hide();
        $('#notes-container').show();
    }

    function closeStatus() {
        $('#status-container').hide(400);
    }
})();
