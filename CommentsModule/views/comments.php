<?php if ($this->comments): foreach ($this->comments as $comment): ?>
    <div class="panel panel-success">
        <p class="panel-heading">
            <strong><?= htmlspecialchars($comment['username']) ?></strong>
            wrote at <strong><?= $comment['date'] ?></strong>
        </p>
        <p class="panel-body"><?= htmlspecialchars($comment['text']) ?></p>
    </div>
<?php endforeach; endif; ?>
