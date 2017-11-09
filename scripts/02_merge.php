<?php
$basePath = dirname(__DIR__);
$fc = new stdClass();
$fc->type = 'FeatureCollection';
$fc->features = array();
foreach(glob($basePath . '/raw/Route_*.json') AS $jsonFile) {
  $json = json_decode(file_get_contents($jsonFile));
  foreach($json AS $jsonLine) {
    $line = new stdClass();
    $line->type = 'Feature';
    $line->properties = new stdClass();
    $line->properties->name = $jsonLine->RouteName;
    $line->properties->info = $jsonLine->RouteInfo;
    $line->properties->lineId = $jsonLine->RouteId;
    $line->geometry = new stdClass();
    $line->geometry->type = 'LineString';
    $line->geometry->coordinates = array();
    foreach($jsonLine->StopData AS $stop) {
      $pointVal = array(floatval($stop->Lon), floatval($stop->Lat));
      $line->geometry->coordinates[] = $pointVal;

      $point = new stdClass();
      $point->type = 'Feature';
      $point->properties = new stdClass();
      $point->properties->name = $stop->StopName;
      $point->properties->scheduleTime = $stop->ScheduleTime;
      $point->properties->dayValue = $stop->DayValue;
      $point->properties->recycleDate = $stop->RecycleDate;
      $point->properties->lineId = $jsonLine->RouteId;
      $point->geometry = new stdClass();
      $point->geometry->type = 'Point';
      $point->geometry->coordinates = $pointVal;
      $fc->features[] = $point;
    }
    $fc->features[] = $line;
  }
}

file_put_contents($basePath . '/routes.json', json_encode($fc));
