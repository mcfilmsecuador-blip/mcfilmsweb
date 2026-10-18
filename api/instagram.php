<?php
// Últimas publicaciones de @mcfilms.ec para el feed de Instagram de la web.
// Lee la API oficial de Meta a través de la página de Facebook "Mcfilms" vinculada a @mcfilms.ec.
// El token NO va en git: se pega en ig_token.txt, una carpeta por encima de public_html (o en api/.ig_token).
// Sirve un token de usuario de Facebook (de larga duración); la primera vez se cambia solo
// por el token de la página, que no caduca. También acepta un token de Instagram (empieza por "IG").
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=900');

const IG_USERNAME = 'mcfilms.ec';
const GRAPH = 'https://graph.facebook.com/v21.0/';

$tokenFiles = [dirname($_SERVER['DOCUMENT_ROOT']) . '/ig_token.txt', __DIR__ . '/.ig_token'];
$cacheFile = __DIR__ . '/.ig_cache.json';
$empty = '{"data":[]}';

if (is_file($cacheFile) && time() - filemtime($cacheFile) < 3600) { readfile($cacheFile); exit; }
$fallback = function () use ($cacheFile, $empty) { echo is_file($cacheFile) ? file_get_contents($cacheFile) : $empty; exit; };

// Diagnóstico temporal sin datos sensibles: ?diag=1
if (isset($_GET['diag'])) {
  $info = ['docroot' => $_SERVER['DOCUMENT_ROOT'], 'busca' => $tokenFiles, 'existe' => array_map('is_file', $tokenFiles), 'cache' => is_file($cacheFile)];
  foreach ($tokenFiles as $f) if (is_file($f)) {
    $r = trim(file_get_contents($f)); $j = json_decode($r, true);
    $info['largo'] = strlen($r); $info['formato'] = is_array($j) ? implode(',', array_keys($j)) : (substr($r, 0, 3) . '…');
    $t = is_array($j) ? ($j['page_token'] ?? $j['token'] ?? '') : $r;
    $ch = curl_init('https://graph.facebook.com/v21.0/me?fields=id,name&access_token=' . urlencode($t)); curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); $b = json_decode(curl_exec($ch), true);
    $info['meta'] = isset($b['error']) ? $b['error']['message'] : ($b['name'] ?? 'ok');
    break;
  }
  echo json_encode($info, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES); exit;
}

$tokenFile = null;
foreach ($tokenFiles as $f) { if (is_file($f)) { $tokenFile = $f; break; } }
$raw = $tokenFile ? trim(file_get_contents($tokenFile)) : '';
if ($raw === '') $fallback();

function ig_get($url) {
  $ch = curl_init($url);
  curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8]);
  $body = curl_exec($ch);
  curl_close($ch);
  return $body ? json_decode($body, true) : null;
}

$cfg = json_decode($raw, true);
if (!is_array($cfg)) $cfg = ['token' => $raw];

if (!empty($cfg['token']) && strpos($cfg['token'], 'IG') === 0) {
  // Token de Instagram (API con inicio de sesión de Instagram): se renueva cada semana
  $token = $cfg['token'];
  if (time() - filemtime($tokenFile) > 7 * 86400) {
    $r = ig_get('https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' . urlencode($token));
    if (!empty($r['access_token'])) { @file_put_contents($tokenFile, $r['access_token']); $token = $r['access_token']; } else { @touch($tokenFile); }
  }
  $q = '&access_token=' . urlencode($token);
  $media = ig_get('https://graph.instagram.com/me/media?fields=media_type,media_url,thumbnail_url,permalink&limit=18' . $q);
  $me = ig_get('https://graph.instagram.com/me?fields=username,followers_count,media_count' . $q);
} else {
  // Token de Facebook: la primera vez se busca la página vinculada a @mcfilms.ec y se guarda su token (no caduca)
  if (empty($cfg['page_token']) || empty($cfg['ig_id'])) {
    $acc = ig_get(GRAPH . 'me/accounts?fields=access_token,instagram_business_account{id,username}&limit=100&access_token=' . urlencode($cfg['token'] ?? ''));
    foreach (($acc['data'] ?? []) as $p) {
      if (($p['instagram_business_account']['username'] ?? '') === IG_USERNAME) {
        $cfg = ['page_token' => $p['access_token'], 'ig_id' => $p['instagram_business_account']['id']];
        @file_put_contents($tokenFile, json_encode($cfg));
        break;
      }
    }
    if (empty($cfg['page_token'])) $fallback();
  }
  $q = '&access_token=' . urlencode($cfg['page_token']);
  $media = ig_get(GRAPH . $cfg['ig_id'] . '/media?fields=media_type,media_url,thumbnail_url,permalink&limit=18' . $q);
  $me = ig_get(GRAPH . $cfg['ig_id'] . '?fields=username,followers_count,media_count' . $q);
}

if (empty($media['data'])) $fallback();

$out = ['data' => [], 'profile' => [
  'username' => $me['username'] ?? IG_USERNAME,
  'followers' => $me['followers_count'] ?? null,
  'posts' => $me['media_count'] ?? null,
]];
foreach ($media['data'] as $m) {
  $img = $m['media_type'] === 'VIDEO' ? ($m['thumbnail_url'] ?? null) : ($m['media_url'] ?? null);
  if ($img) $out['data'][] = ['img' => $img, 'url' => $m['permalink'], 'video' => $m['media_type'] === 'VIDEO'];
}
$json = json_encode($out);
@file_put_contents($cacheFile, $json);
echo $json;
