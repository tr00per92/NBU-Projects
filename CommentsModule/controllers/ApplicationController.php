<?php

class ApplicationController {
    const MIN_COMMENT_LENGTH = 2;
    const MIN_USERNAME_LENGTH = 2;
    const MIN_PASSWORD_LENGTH = 2;

    private static $instance;

    private $commentsManager;
    private $linksManager;
    private $usersManager;
    private $linkId;
    private $comments;

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new ApplicationController();
        }

        return self::$instance;
    }

    public function processRequest() {
        if (!isset($_GET['url'])) {
            die('no url provided.');
        }

        $this->commentsManager = new CommentsDbManager();
        $this->linksManager = new LinksDbManager();
        $this->usersManager = new UsersDbManager();
        $this->linkId = $this->getLinkId($_GET['url']);

        if (isset($_POST['action'])) {
            switch ($_POST['action']) {
                case 'register': $this->register(); break;
                case 'login': $this->login(); break;
                case 'add-comment': $this->addComment(); break;
                case 'logout': $this->logout(); break;
            }
        }

        $this->comments = $this->commentsManager->get($this->linkId);
        $this->setFormToken();
        require_once('views/home.php');
    }

    private function __construct() {}

    private function isLoggedIn() {
        return isset($_SESSION['username']) && isset($_SESSION['userId']);
    }

    private function getLinkId($url) {
        $id = $this->linksManager->getId($url);
        if (!$id) {
            $id = $this->linksManager->add($url);
        }

        return $id;
    }

    private function addComment() {
        if (!$this->isLoggedIn()) {
            $this->addErrorMessage('You must be logged in.');
            return;
        }

        if (!isset($_POST['form-token']) || $_POST['form-token'] !== $_SESSION['form-token']) {
            $this->addErrorMessage('Could not add comment.');
            return;
        }

        $content = trim($_POST['content']);
        if (strlen($content) < self::MIN_COMMENT_LENGTH) {
            $this->addErrorMessage('The comment must be at least ' . self::MIN_COMMENT_LENGTH . ' characters long.');
            return;
        }

        $this->commentsManager->add($this->linkId, $content, $_SESSION['userId']);
    }

    private function login() {
        $user = $this->usersManager->login($_POST['username'], $_POST['password']);
        if (!$user || !isset($_POST['form-token']) ||
            $_POST['form-token'] !== $_SESSION['form-token']) {
            $this->addErrorMessage('Invalid login.');
            return;
        }

        $_SESSION['username'] = $user['username'];
        $_SESSION['userId'] = $user['id'];
    }

    private function register(){
        if (!isset($_POST['form-token']) || $_POST['form-token'] !== $_SESSION['form-token']) {
            $this->addErrorMessage('Registration error.');
            return;
        }

        $username = trim($_POST['username']);
        $password = trim($_POST['password']);
        $confirmPassword = trim($_POST['confirm-password']);
        if (strlen($username) < self::MIN_USERNAME_LENGTH) {
            $this->addErrorMessage('The username must be at least ' . self::MIN_USERNAME_LENGTH . ' characters long.');
            return;
        }

        if (strlen($password) < self::MIN_PASSWORD_LENGTH) {
            $this->addErrorMessage('The password must be at least ' . self::MIN_PASSWORD_LENGTH . ' characters long.');
            return;
        }

        if ($password !== $confirmPassword) {
            $this->addErrorMessage('The passwords do not match.');
            return;
        }

        if (!$this->usersManager->isUsernameValid($username)) {
            $this->addErrorMessage('This username is already taken.');
            return;
        }

        $userId = $this->usersManager->register($username, $password);
        if (!$userId) {
            $this->addErrorMessage('Registration error.');
            return;
        }

        $_SESSION['username'] = $username;
        $_SESSION['userId'] = $userId;
    }

    private function logout() {
        if (isset($_POST['form-token']) && $_POST['form-token'] === $_SESSION['form-token']) {
            unset($_SESSION['username']);
            unset($_SESSION['userId']);
        }
    }

    private function addErrorMessage($msgText) {
        $_SESSION['error'] = $msgText;
    }

    private function setFormToken() {
        if (!isset($_POST['form-token'])) {
            $_SESSION['form-token'] = uniqid(mt_rand(), true);
        }
    }
}
