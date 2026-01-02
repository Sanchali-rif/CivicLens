<?php
header('Content-Type: application/json');
require_once 'config.php';
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST only']);
    exit;
}

if (!isset($_FILES['image'])) {
    echo json_encode(['error' => 'No image uploaded']);
    exit;
}

//  Save file 
$filename = time() . '_' . basename($_FILES['image']['name']);
$target = UPLOAD_DIR . $filename;

if (!move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
    echo json_encode(["error" => "Upload Failed"]);
    exit;
}

//  Collect Form Data 
$description = $_POST['description'] ?? null;
$user_id = $_POST['user_id'] ?? null;

$latitude  = !empty($_POST['lat']) ? floatval($_POST['lat']) : null;
$longitude = !empty($_POST['lng']) ? floatval($_POST['lng']) : null;
$address   = $_POST['address'] ?? null;

//  Run Vision Python Script 
$cmd = PYTHON_BIN . " " . escapeshellcmd(VISION_SCRIPT) . " " . escapeshellarg($target);
$output = shell_exec($cmd);

if (!$output) {
    echo json_encode(["error" => "Python script failed"]);
    exit;
}

$result = json_decode($output, true);

if (!$result) {
    echo json_encode(["error" => "Invalid JSON from Python script"]);
    exit;
}

//   Insert into DB  
try {

    $stmt = $pdo->prepare("
        INSERT INTO issues 
        (user_id, image_file, description, 
         issue_type, priority, confidence, reason,
         ai_model, decision_engine, vision_raw_json,
         latitude, longitude, address)
        VALUES 
        (:user_id, :image_file, :description,
         :issue_type, :priority, :confidence, :reason,
         :ai_model, :decision_engine, :vision_raw_json,
         :lat, :lng, :address)
    ");

    $stmt->execute([
        ':user_id' => $user_id,
        ':image_file' => $filename,
        ':description' => $description,
        ':issue_type' => $result['issue_type'] ?? null,
        ':priority' => $result['priority'] ?? 'LOW',
        ':confidence' => $result['confidence'] ?? null,
        ':reason' => $result['reason'] ?? null,
        ':ai_model' => $result['ai_metadata']['model'] ?? 'Google Vision API',
        ':decision_engine' => $result['ai_metadata']['decision_engine'] ?? 'CivicLens Unified Logic v1.0',
        ':vision_raw_json' => json_encode($result, JSON_UNESCAPED_UNICODE),
        ':lat' => $latitude,
        ':lng' => $longitude,
        ':address' => $address
    ]);

    $issueId = $pdo->lastInsertId();

    echo json_encode([
        "success" => true,
        "issue_id" => $issueId,
        "file" => $filename,
        "vision_result" => $result
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}