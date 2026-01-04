<?php
session_start();
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$google_id = $data['google_id'];
$email     = $data['email'];
$name      = $data['name'];

$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 1) {
    $user = $res->fetch_assoc();
} else {
    $ins = $conn->prepare(
        "INSERT INTO users (google_id, email, name)
         VALUES (?, ?, ?)"
    );
    $ins->bind_param("sss", $google_id, $email, $name);
    $ins->execute();
    $user = ["id" => $ins->insert_id];
}

$_SESSION['user_id'] = $user['id'];

echo json_encode(["success" => true]);
