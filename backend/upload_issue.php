<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

require_once 'config.php';
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST only']);
    exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['error' => 'No image uploaded']);
    exit;
}


$uploadDir = rtrim(UPLOAD_DIR, '/') . '/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$filename = time() . '_' . basename($_FILES['image']['name']);
$target   = $uploadDir . $filename;

if (!move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
    echo json_encode([
        'error' => 'Upload failed',
        'tmp'   => $_FILES['image']['tmp_name'],
        'dest'  => $target
    ]);
    exit;
}

$description = $_POST['description'] ?? null;
$user_id     = $_POST['user_id'] ?? null;

$latitude  = !empty($_POST['lat']) ? floatval($_POST['lat']) : null;
$longitude = !empty($_POST['lng']) ? floatval($_POST['lng']) : null;
$address   = $_POST['address'] ?? null;

$python = escapeshellarg(PYTHON_BIN);
$script = escapeshellarg(VISION_SCRIPT);
$image = escapeshellarg(realpath($target));

$cmd = "$python $script $image 2>&1";
$output = shell_exec($cmd);

if ($output === null || trim($output) === '') {
    echo json_encode([
        'success' => false,
        'error'   => 'Python script failed',
        'cmd'     => $cmd
    ]);
    exit;
}

$result = json_decode($output, true);

if (json_last_error() !== JSON_ERROR_NONE || !is_array($result)) {
    echo json_encode([
        'success' => false,
        'error'   => 'Invalid JSON from Python',
        'raw'     => $output
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO issues (
            user_id,
            image_file,
            description,
            issue_type,
            priority,
            confidence,
            reason,
            ai_model,
            decision_engine,
            vision_raw_json,
            latitude,
            longitude,
            address
        ) VALUES (
            :user_id,
            :image_file,
            :description,
            :issue_type,
            :priority,
            :confidence,
            :reason,
            :ai_model,
            :decision_engine,
            :vision_raw_json,
            :lat,
            :lng,
            :address
        )
    ");

    $stmt->execute([
        ':user_id'         => $user_id,
        ':image_file'      => $filename,
        ':description'     => $description,
        ':issue_type'      => $result['issue_type'] ?? null,
        ':priority'        => $result['priority'] ?? 'LOW',
        ':confidence'      => $result['confidence'] ?? null,
        ':reason'          => $result['reason'] ?? null,
        ':ai_model'        => $result['ai_metadata']['model'] ?? 'Google Vision API',
        ':decision_engine' => $result['ai_metadata']['decision_engine'] ?? 'CivicLens Unified Logic v1.0',
        ':vision_raw_json' => json_encode($result, JSON_UNESCAPED_UNICODE),
        ':lat'             => $latitude,
        ':lng'             => $longitude,
        ':address'         => $address
    ]);

    echo json_encode([
        'success'  => true,
        'issue_id' => $pdo->lastInsertId(),
        'file'     => $filename
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error'   => $e->getMessage()
    ]);
}
