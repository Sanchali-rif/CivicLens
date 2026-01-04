<?php
header("Content-Type: application/json");
echo json_encode([
  "status" => "CivicLens backend running",
  "time" => date("c")
]);
