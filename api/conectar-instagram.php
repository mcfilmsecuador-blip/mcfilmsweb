<?php
// Página de un solo uso para guardar la clave de Instagram en el servidor (api/.ig_token, protegido por .htaccess).
// Solo acepta una clave nueva si todavía no hay un feed funcionando.
header('X-Robots-Tag: noindex, nofollow');
$tokenFile = __DIR__ . '/.ig_token';
$cacheFile = __DIR__ . '/.ig_cache.json';
$funciona = is_file($cacheFile) && strpos(file_get_contents($cacheFile), '"img"') !== false;
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $t = trim($_POST['clave'] ?? '');
  if ($funciona) {
    $msg = 'Instagram ya está conectado. No hace falta otra clave.';
  } elseif (!preg_match('/^(EAA|IG)[A-Za-z0-9_\-]{40,}$/', $t)) {
    $msg = 'Esa clave no parece válida. Copia el código completo que empieza por EAA.';
  } elseif (@file_put_contents($tokenFile, $t) === false) {
    $msg = 'No se pudo guardar en el servidor.';
  } else {
    @unlink($cacheFile);
    $ch = curl_init('https://' . $_SERVER['HTTP_HOST'] . '/api/instagram.php');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20]);
    $d = json_decode(curl_exec($ch), true);
    $n = count($d['data'] ?? []);
    $msg = $n ? "¡Listo! Instagram conectado: $n publicaciones cargadas. Ya puedes cerrar esta página."
              : 'La clave se guardó, pero Instagram no devolvió publicaciones. Avísale a Claude.';
    $funciona = $n > 0;
  }
}
?><!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Conectar Instagram · MCFILMS</title>
<style>
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;background:#f5f5f2;color:#0b0b0c;display:grid;place-items:center;min-height:100vh;padding:20px;box-sizing:border-box}
.c{background:#fff;border-radius:24px;padding:32px;max-width:460px;width:100%;box-shadow:0 30px 70px -35px rgba(0,0,0,.35)}
h1{font-size:22px;margin:0 0 8px}p{color:#5b5c61;line-height:1.5;margin:0 0 18px}
textarea{width:100%;box-sizing:border-box;height:120px;border:1px solid #e7e7e3;border-radius:14px;padding:14px;font:14px ui-monospace,Menlo,monospace}
button{margin-top:12px;width:100%;height:52px;border:0;border-radius:12px;background:#F5C518;font-size:16px;font-weight:600;cursor:pointer}
.m{margin-top:16px;padding:14px;border-radius:12px;background:#f5f5f2;font-weight:500}
</style></head><body><div class="c">
<h1>Conectar Instagram</h1>
<?php if ($funciona && !$msg): ?>
  <p>Instagram ya está conectado a la web. No tienes que hacer nada más.</p>
<?php else: ?>
  <p>Pega aquí la clave que copiaste de Meta (empieza por <b>EAA</b>) y pulsa Guardar.</p>
  <form method="post"><textarea name="clave" required autocomplete="off" spellcheck="false" placeholder="EAA..."></textarea><button>Guardar</button></form>
<?php endif; ?>
<?php if ($msg): ?><div class="m"><?= htmlspecialchars($msg) ?></div><?php endif; ?>
</div></body></html>
