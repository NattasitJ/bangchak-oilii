<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$url = 'https://oil-price.bangchak.co.th/ApiOilPrice2/th';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'User-Agent: Mozilla/5.0'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 && $response) {
    echo $response;
} else {
    http_response_code(502);
    echo json_encode(['error' => 'Failed to fetch oil prices', 'httpCode' => $httpCode]);
}
