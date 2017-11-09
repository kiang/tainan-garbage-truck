<?php
/*
info from 06-2686660 #122 洪小姐
*/

$rawPath = dirname(__DIR__) . '/raw';
if(!file_exists($rawPath)) {
  mkdir($rawPath, 0777, true);
}

$areasFile = $rawPath . '/Areas.json';
if(!file_exists($areasFile)) {
  file_put_contents($areasFile, postData('http://clean.tnepb.gov.tw/api/Region', array()));
}
$areas = json_decode(file_get_contents($areasFile), true);

foreach($areas AS $area) {
  $areaFile = $rawPath . "/Area_{$area['Area']}.json";
  if(!file_exists($areaFile)) {
    file_put_contents($areaFile, postData('http://clean.tnepb.gov.tw/api/Route', array('Area' => $area['Area'])));
  }
  $routes = json_decode(file_get_contents($areaFile), true);

  foreach($routes AS $route) {
    if(isset($route['RouteId'])) {
      $routeFile = $rawPath . "/Route_{$area['Area']}_{$route['RouteId']}.json";
      if(!file_exists($routeFile)) {
        file_put_contents($routeFile, postData('http://clean.tnepb.gov.tw/api/DynamicRoute', array('RouteId' => $route['RouteId'])));
      }
    }
  }
}

function postData($url, $data) {
  if(empty($data)) {
    $data_string = '{}';
  } else {
    $data_string = json_encode($data);
  }

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      'Content-Length: ' . strlen($data_string))
  );
  return curl_exec($ch);
}
