<?php

session_start();
require_once('controllers/ApplicationController.php');
ApplicationController::getInstance()->processRequest();

function __autoload($className) {
    if (file_exists("dbManagers/$className.php")) {
        require_once("dbManagers/$className.php");
    }
}
