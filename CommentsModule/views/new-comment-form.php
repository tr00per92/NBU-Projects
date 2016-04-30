<div class="panel panel-primary">
    <div class="panel-heading">
        <form method="post">
            Hello, <strong><?= htmlspecialchars($_SESSION['username']) ?></strong>!
            <a href="#" id="logout">[logout]</a>
            <input type="hidden" name="action" value="logout">
            <input type="hidden" name="form-token" value="<?= $_SESSION['form-token'] ?>">
        </form>
    </div>
    <div class="panel-body">
        <form method="post">
            <div class="form-group no-padding-left">
                <textarea name="content" id="content" class="form-control" rows="3" placeholder="Enter your comment..."></textarea>
            </div>
            <input type="hidden" name="action" value="add-comment">
            <input type="hidden" name="form-token" value="<?= $_SESSION['form-token'] ?>">
            <div class="form-group text-right no-margin-bottom">
                <button type="submit" class="btn btn-primary">Add comment</button>
            </div>
        </form>
    </div>
</div>
