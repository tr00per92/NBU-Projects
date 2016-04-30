<?php

abstract class BaseDbManager {
    private static $connected;

    public function __construct() {
        if (!self::$connected) {
            require_once('config.php');
            require_once('libs/rb.php');
            R::setup(DB_TYPE . ':host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
            if (R::testConnection()) {
                self::$connected = true;
            }
        }
    }
}
