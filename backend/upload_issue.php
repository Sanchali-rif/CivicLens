<?php
header('Content-Type: application/json');
require_once 'config.php';
require_once 'db.php';
if($_SERVER['REQUEST_METHOD'] !== 'POST')
{
    http_response_code(405);
    echo json_encode(['error' => 'POST only']);
    exit;
}
if(!isset($_FILES['image'])) 
{
    echo json_encode(['error' => 'No image uploaded']);
    exit;
}
$filename=time().'_'.basename($_FILES['image']['name']);
$target=UPLOAD_DIR . $filename;
if(!move_uploaded_file($_FILES['image']['tmp_name'], $target))
{
    echo json_encode(["error" => "Upload Failed"]);
    exit;
}
$description=$_POST['description'] ?? null;
$user_id=$_POST['user_id'] ?? null;
$cmd=escapeshellcmd(PYTHON_BIN . " " . VISION_SCRIPT ." " . escapeshellarg($target) . " " . escapeshellarg(GOOGLE_CREDENTIALS));
$output=shell_exec($cmd);
if(!$output)
{
    echo json_encode(["error" => "Python script failed"]);
    exit;
}
$result=json_decode($output, true);
if(!$result)
{
    echo json_encode(["error" => "Invalid JSON from Python script"]);
    exit;
}
echo json_encode(["success" => true,"file" => $filename, "vision_result" => $result]);
?>