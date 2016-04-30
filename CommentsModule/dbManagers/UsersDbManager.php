<?php

class UsersDbManager extends BaseDbManager {
    const TABLE_NAME = 'users';

    public function register($username, $password) {
        $user = R::dispense(self::TABLE_NAME);
        $user['username'] = $username;
        $user['password'] = password_hash($password, PASSWORD_DEFAULT);
        $userId = R::store($user);

        return $userId;
    }

    public function login($username, $password) {
        $user = R::findOne(self::TABLE_NAME, 'username = ?', [$username]);
        if (!$user || !password_verify($password, $user['password'])) {
            return null;
        }

        return $user;
    }

    public function isUsernameValid($username) {
        $user = R::findOne(self::TABLE_NAME, 'username = ?', [$username]);
        if (!$user) {
            return true;
        }

        return false;
    }

    public function changePassword($username, $password, $newPassword) {
        $user = R::findOne(self::TABLE_NAME, 'username = ?', [$username]);
        if (!$user || !password_verify($password, $user['password'])) {
            return false;
        }

        $user['password'] = password_hash($newPassword, PASSWORD_DEFAULT);
        $userId = R::store($user);
        return $userId > 0;
    }
}
