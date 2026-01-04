<?php
require_once 'config.php';

try {
    $databaseUrl = getenv('DATABASE_URL');

    if (!$databaseUrl) {
        throw new Exception("DATABASE_URL not set");
    }

    $dbopts = parse_url($databaseUrl);

    $host = $dbopts["host"];
    $port = $dbopts["port"];
    $user = $dbopts["user"];
    $pass = $dbopts["pass"];
    $dbname = ltrim($dbopts["path"], '/');

    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

} catch (Exception $e) {
    http_response_code(500);
    die("DB connection failed");
}
