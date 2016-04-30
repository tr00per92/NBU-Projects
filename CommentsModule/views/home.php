<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Comments Module</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="content/styles.css"
</head>
<body>
<?php
require_once('views/error.php');
if ($this->isLoggedIn()) require_once('views/new-comment-form.php');
else require_once('views/user-forms.php');
require_once('views/comments.php')
?>
<script src="content/scripts.js"></script>
</body>
</html>
