<?php
require_once 'config.php';
try
{
    $pdo= new PDO("mysql:host=localhost;dbname=civiclens;charset=utf8","root","");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(Exception $e)
{
    die("DB connection failed");
}
?>