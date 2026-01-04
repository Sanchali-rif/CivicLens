<?php

// CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'config.php';
require_once 'db.php';

try {
    $stmt = $pdo->query("
        SELECT 
            id,
            user_id,
            image_file,
            issue_type,
            priority,
            confidence,
            reason,
            address,
            status,
            created_at
        FROM issues
        ORDER BY 
            CASE priority
                WHEN 'HIGH' THEN 1
                WHEN 'MEDIUM' THEN 2
                ELSE 3
            END,
            created_at DESC
    ");

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
