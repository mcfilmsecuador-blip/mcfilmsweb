<?php
// Últimas publicaciones de @mcfilms.ec para el muro de Instagram de la web.
// Usa la API oficial (Instagram API con inicio de sesión de Instagram).
// El token NO va en git: se guarda en ig_token.txt fuera de public_html (o en api/.ig_token).
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=900');

$tokenFiles = [dirname($_SERVER['DOCUMENT_ROOT']) . '/ig_token.txt', __DIR__ . '/.ig_token'];
$cacheFile = __DIR__ . '/.ig_cache.json';

if (is_file($cacheFile) && time() - filemtime($cacheFile) < 3600) { readfile($cacheFile); exit; }

$tokenFile = null;
foreach ($tokenFiles as $f) { if (is_file($f)) { $tokenFile = $f; break; } }
$token = $tokenFile ? trim(file_get_contents($tokenFile)) : '';
if ($token === '') { echo is_file($cacheFile) ? file_get_contents($cacheFile) : '{"data":[]}'; exit; }

function ig_get($url) {
  $ch = curl_init($url);
  curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8]);
  $body = curl_exec($ch);
  curl_close($ch);
  return $body ? json_decode($body, true) : null;
}

// El token dura 60 días: se renueva solo cada semana
if (time() - filemtime($tokenFile) > 7 * 86400) {
  $r = ig_get('https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' . urlencode($token));
  if (!empty($r['access_token'])) { @file_put_contents($tokenFile, $r['access_token']); $token = $r['access_token']; }
  else { @touch($tokenFile); }
}

$q = '&access_token=' . urlencode($token);
$media = ig_get('https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,timestamp&limit=18' . $q);
$me = ig_get('https://graph.instagram.com/me?fields=username,followers_count,media_count' . $q);

if (empty($media['data'])) { echo is_file($cacheFile) ? file_get_contents($cacheFile) : '{"data":[]}'; exit; }

$out = ['data' => [], 'profile' => [
  'username' => $me['username'] ?? 'mcfilms.ec',
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
