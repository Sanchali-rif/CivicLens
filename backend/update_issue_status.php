<?php
// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$issue_id = $data['issue_id'] ?? null;
$status   = $data['status'] ?? null;

if (!$issue_id || !$status) {
    echo json_encode([
        "success" => false,
        "error" => "issue_id and status required"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "UPDATE issues SET status = :status WHERE id = :id"
    );

    $stmt->execute([
        ':status' => $status,
        ':id' => $issue_id
    ]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
