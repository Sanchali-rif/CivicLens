<?php

// CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'config.php';
require_once 'db.php';

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode([
        "success" => false,
        "error" => "user_id required"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            id,
            image_file,
            issue_type,
            priority,
            confidence,
            reason,
            address,
            status,
            created_at
        FROM issues
        WHERE user_id = :user_id
        ORDER BY created_at DESC
    ");

    $stmt->execute([':user_id' => $user_id]);
    $issues = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "issues" => $issues
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
