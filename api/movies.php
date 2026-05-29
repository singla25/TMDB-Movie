<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

/*
|--------------------------------------------------------------------------
| Include Config
|--------------------------------------------------------------------------
*/

include '../config.php';

/*
|--------------------------------------------------------------------------
| Get Search Query
|--------------------------------------------------------------------------
*/

$search = $_GET['search'] ?? '';

/*
|--------------------------------------------------------------------------
| Build API URL
|--------------------------------------------------------------------------
*/

if($search !== ''){

    $url =
    "https://api.themoviedb.org/3/search/movie?query="
    . urlencode($search)
    . "&api_key="
    . TMDB_API_KEY;

} else {

    $url =
    "https://api.themoviedb.org/3/trending/movie/day?api_key="
    . TMDB_API_KEY;
}

/*
|--------------------------------------------------------------------------
| Initialize HTTP Request for API inPHP
|--------------------------------------------------------------------------
*/

// 1. Initialize
// $ch = curl_init();

// 2. Set options
// curl_setopt($ch, CURLOPT_URL, "https://api.example.com/data");
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // return response as string

// 3. Execute
// $response = curl_exec($ch);

// 4. Close
// curl_close($ch);


// Example
// $ch = curl_init();

// curl_setopt_array($ch, [
//     CURLOPT_URL            => "https://api.example.com/users",
//     CURLOPT_RETURNTRANSFER => true,
//     CURLOPT_HTTPHEADER     => [
//         "Authorization: Bearer YOUR_TOKEN",
//         "Content-Type: application/json"
//     ],
// ]);

// $response = curl_exec($ch);
// $data = json_decode($response, true); // parse JSON
// curl_close($ch);

/*
|--------------------------------------------------------------------------
| END cURL in API
|--------------------------------------------------------------------------
*/


// 1. Initialize cURL
$curl = curl_init();

// 2. Set options
curl_setopt_array($curl,[
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 30
]);


// 3. Execute Request
$response = curl_exec($curl);

$error = curl_error($curl);

$http_code =
curl_getinfo(
    $curl,
    CURLINFO_HTTP_CODE
);

// 4. Close
curl_close($curl);


// Handle Errors
if($error){
    echo json_encode([
        'status' => false,
        'message' => $error
    ]);

    exit;
}

if($http_code !== 200){
    echo json_encode([
        'status' => false,
        'message' => 'TMDB API Failed',
        'http_code' => $http_code
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Return API Response
|--------------------------------------------------------------------------
*/

echo $response;