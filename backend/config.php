<?php

define('UPLOAD_DIR', __DIR__ . '/uploads/');

define(
    'PYTHON_BIN',
    'C:\\Users\\sahas\\AppData\\Local\\Programs\\Python\\Python312\\python.exe'
);

// python-scripts is ONE LEVEL ABOVE backend
define(
    'VISION_SCRIPT',
    dirname(__DIR__) . '/python-scripts/vision_test.py'
);

// correct credentials path
define(
    'GOOGLE_CREDENTIALS',
    __DIR__ . '/key/service-account.json'
);
