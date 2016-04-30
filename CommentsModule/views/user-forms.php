<form method="post" id="login-form" class="panel panel-primary">
    <div class="panel-heading">Please login</div>
    <div class="panel-body">
        <div class="form-group col-xs-6 no-padding-left">
            <input type="text" class="form-control" placeholder="Username" name="username">
        </div>
        <div class="form-group col-xs-6 no-padding-left no-padding-right">
            <input type="password" class="form-control" placeholder="Password" name="password">
        </div>
        <input type="hidden" name="action" value="login">
        <input type="hidden" name="form-token" value="<?= $_SESSION['form-token'] ?>">
        <div class="form-group no-margin-bottom">
            <button type="submit" class="btn btn-primary">Login</button>
            <button type="button" class="btn btn-default" id="register">Register now</button>
        </div>
    </div>
</form>
<form method="post" id="register-form" class="panel panel-primary">
    <div class="panel-heading">Registration</div>
    <div class="panel-body">
        <div class="form-group col-xs-4 no-padding-left">
            <input type="text" class="form-control" placeholder="Username" name="username">
        </div>
        <div class="form-group col-xs-4 no-padding-left">
            <input type="password" class="form-control" placeholder="Password" name="password">
        </div>
        <div class="form-group col-xs-4 no-padding-left no-padding-right">
            <input type="password" class="form-control" placeholder="Confirm password" name="confirm-password">
        </div>
        <input type="hidden" name="action" value="register">
        <input type="hidden" name="form-token" value="<?= $_SESSION['form-token'] ?>">
        <div class="form-group no-margin-bottom">
            <button type="submit" class="btn btn-primary">Register now</button>
            <button type="button" class="btn btn-default" id="login">Back to login</button>
        </div>
    </div>
</form>
