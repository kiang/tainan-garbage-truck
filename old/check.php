<?php
$json = json_decode(file_get_contents(__DIR__ . '/gt.json'), true);
foreach($json AS $line) {
  foreach($line['points'] AS $point) {
    $point['x'] = floatval($point['x']);
    $point['y'] = floatval($point['y']);
    if($point['x'] > 23.427753 || $point['x'] < 22.874693 || $point['y'] > 120.669614 || $point['y'] < 120.021420) {
      echo "[{$line['truckno']}]{$line['trackname']} - {$point['pointname']} [{$point['x']}, {$point['y']}]\n";
    }
  }
}
