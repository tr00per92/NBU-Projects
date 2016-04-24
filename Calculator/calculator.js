(function () {
    'use strict';

    var display = document.getElementById('display'),
        buttons = document.getElementsByClassName('calc-btn'),
        displayValue = '';

    var validateInput = function () {
        var newValue = display.value;
        if (newValue === '') {
            displayValue = '';
        } else if (/^[\d\+\-\*\/\(\)\.]+$/.test(newValue) && !/[\+\-\*\/\.]{2,}/.test(newValue)) {
            displayValue = newValue;
        } else {
            display.value = displayValue;
        }
    };

    var calculate = function (input) {
        switch (input) {
            case 'C':
                display.value = '';
                break;
            case '=':
                display.value = eval(display.value);
                break;
            default:
                display.value += input;
                break;
        }

        validateInput();
    };

    [].forEach.call(buttons, function (btn) {
        btn.addEventListener('click', function () {
            calculate(btn.innerText);
        });
    });

    display.addEventListener('input', validateInput);

    display.addEventListener('keydown', function (event) {
        if (event.keyCode === 46) {
            event.preventDefault();
            calculate('C');
        }
    });

    display.addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            calculate('=');
        }
    });
})();
