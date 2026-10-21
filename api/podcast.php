<?php
// Episodios del podcast «Detrás de las bodas» desde su RSS público (Spotify for Creators).
// La web reproduce el audio con su propio reproductor; aquí solo se leen título, audio y duración.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=900');

const RSS = 'https://anchor.fm/s/1185fdc50/podcast/rss';
$cacheFile = __DIR__ . '/.podcast_cache.json';
if (is_file($cacheFile) && time() - filemtime($cacheFile) < 3600) { readfile($cacheFile); exit; }
$fallback = function () use ($cacheFile) { header('Cache-Control: no-store'); echo is_file($cacheFile) ? file_get_contents($cacheFile) : '{"episodes":[]}'; exit; };

$ch = curl_init(RSS);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8, CURLOPT_FOLLOWLOCATION => true]);
$xml = curl_exec($ch);
curl_close($ch);
if (!$xml) $fallback();
$rss = @simplexml_load_string($xml);
if (!$rss || !isset($rss->channel->item)) $fallback();

$eps = [];
foreach ($rss->channel->item as $it) {
  $audio = (string) $it->enclosure['url'];
  if (!preg_match('#^https://#', $audio)) continue;
  $it_ns = $it->children('http://www.itunes.com/dtds/podcast-1.0.dtd');
  $eps[] = ['title' => trim((string) $it->title), 'audio' => $audio, 'duration' => trim((string) $it_ns->duration), 'date' => date('c', strtotime((string) $it->pubDate))];
}
if (!$eps) $fallback();
$out = json_encode(['episodes' => $eps], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
file_put_contents($cacheFile, $out);
echo $out;
