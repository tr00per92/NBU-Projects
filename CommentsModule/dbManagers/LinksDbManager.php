<?php

class LinksDbManager extends BaseDbManager {
    const TABLE_NAME = 'links';

    public function add($url) {
        $link = R::dispense(self::TABLE_NAME);
        $link['url'] = $url;
        $linkId = R::store($link);

        return $linkId;
    }

    public function getId($url) {
        $link = R::findOne(self::TABLE_NAME, 'url = ?', [$url]);
        if (!$link) {
            return null;
        }

        return $link['id'];
    }
}
