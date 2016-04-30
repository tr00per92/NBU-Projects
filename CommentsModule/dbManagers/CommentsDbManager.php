<?php

class CommentsDbManager extends BaseDbManager {
    const TABLE_NAME = 'comments';

    public function get($linkId) {
        $sql = 'SELECT text, date, username FROM ' . self::TABLE_NAME .
               ' c JOIN users u ON c.user_id = u.id WHERE link_id = ? ORDER BY date DESC';
        $comments = R::getAll($sql, [$linkId]);
        return $comments;
    }

    public function add($linkId, $text, $userId) {
        $comment = R::dispense(self::TABLE_NAME);
        $comment['link_id'] = $linkId;
        $comment['text'] = $text;
        $comment['date'] = R::isoDateTime();
        $comment['user_id'] = $userId;
        $commentId = R::store($comment);

        return $commentId;
    }

    public function remove($commentId) {
        $comment = R::load(self::TABLE_NAME, $commentId);
        R::trash($comment);
    }
}
