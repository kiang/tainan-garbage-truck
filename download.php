<?php
$json = json_decode(file_get_contents('http://59.127.100.77/gt/gt.asp'));
file_put_contents(__DIR__ . '/gt.json', json_encode($json, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
