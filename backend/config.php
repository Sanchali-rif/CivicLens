<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/**
 * Upload directory (inside container)
 */
define('UPLOAD_DIR', __DIR__ . '/uploads/');


define('PYTHON_BIN', '/usr/bin/python3');


define(
    'VISION_SCRIPT',
    __DIR__ . '/python-scripts/vision_test.py'
);

define(
    'GOOGLE_CREDENTIALS',
    __DIR__ . '/key/service-account.json'
);
