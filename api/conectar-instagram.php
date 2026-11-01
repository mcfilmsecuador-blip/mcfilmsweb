<?php
// Instagram ya está conectado: esta página quedó desactivada para que nadie pueda cambiar la clave del feed.
// Para volver a conectarlo, recuperar la versión anterior desde el historial de git y borrarla al terminar.
http_response_code(410);
header('X-Robots-Tag: noindex, nofollow');
echo 'Desactivado.';
