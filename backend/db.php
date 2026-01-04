<?php
try {
    $databaseUrl = getenv('DATABASE_URL');

    if (!$databaseUrl) {
        throw new Exception("DATABASE_URL not set");
    }

    $dbopts = parse_url($databaseUrl);

    $host = $dbopts["host"];
    $port = $dbopts["port"] ?? 5432;
    $user = $dbopts["user"];
    $pass = $dbopts["pass"];
    $dbname = ltrim($dbopts["path"], "/");

    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "DB connection failed",
        "details" => $e->getMessage()
    ]);
    exit;
}
