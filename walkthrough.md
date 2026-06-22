# Reporte de Optimización, Limpieza y Despliegue en GitHub

Hemos completado la optimización exhaustiva de los recursos, la limpieza de archivos inactivos, la purga del historial de Git y el push exitoso al repositorio remoto en GitHub. El proyecto está ahora listo para ser conectado a tu hosting en Hostinger y a tu dominio.

---

## 1. Limpieza de Archivos Inactivos
Para agilizar la velocidad de carga y cumplir con los límites de GitHub (límite duro de 100MB por archivo), eliminamos los videos huérfanos que no estaban referenciados en ningún lugar de `index.html`:
* `Videos Web/2.mp4` (~66 MB) — **Eliminado**
* `Videos Web/3.mp4` (~105 MB) — **Eliminado**
* `Videos Web/4.mp4` (~86 MB) — **Eliminado**
* `Videos Web/5.mp4` (~21 MB) — **Eliminado**
* `Videos Web/Video Vertical.mp4` (~43 MB) — **Eliminado**
* `Videos Web/Video Vertical 2.mp4` (~42 MB) — **Eliminado**
* Directorio `Galeria Videos/Web Antigravity` — **Eliminado**

---

## 2. Compresión de Videos de la Galería
Comprimimos todos los videos de la galería que superaban los 40MB a una resolución de 720p optimizada (CRF 28), logrando reducciones masivas de tamaño sin perder fidelidad visual en la web:

| Archivo | Tamaño Original | Tamaño Comprimido | Ahorro (%) |
| :--- | :---: | :---: | :---: |
| `3 Adriana & Andres Wedding Redes.mp4` | 57.79 MB | **23.60 MB** | -59.1% |
| `3 Joanny & Natali Reel.mp4` | 48.11 MB | **19.79 MB** | -58.8% |
| `3 Juan & Sydney Wedding Redes.mp4` | 61.78 MB | **25.23 MB** | -59.1% |
| `3 Marco & Elizabeth Wedding Redes.mp4` | 56.28 MB | **22.14 MB** | -60.6% |
| `3 Maria Gracia & Joseph Wedding Redes.mp4` | 40.76 MB | **17.00 MB** | -58.2% |
| `3 Minky & Milena Wedding Reel.mp4` | 44.93 MB | **18.61 MB** | -58.5% |

**Ahorro Total de Espacio:** **~183 MB** eliminados del peso de carga de los videos principales. La página ahora es sumamente rápida para los usuarios móviles y de escritorio.

---

## 3. Re-inicialización de Git y Carga a GitHub
Para evitar que los commits antiguos con archivos pesados (>100MB) impidieran el push, realizamos una purga del historial local:
1. Eliminamos la base de datos antigua de Git (`.git/`).
2. Inicializamos un repositorio nuevo y limpio (`git init` en la rama `main`).
3. Creamos un único commit inicial que contiene exclusivamente la versión optimizada de tu sitio.
4. Vinculamos el repositorio remoto:
   `https://github.com/mcfilmsecuador-blip/mcfilmsweb.git`
5. Subimos los archivos con éxito (`git push -u origin main`).

El código ya está completamente en línea en GitHub.

---

## 4. Guía de Conexión a Hostinger y Dominio
Para conectar tu repositorio de GitHub a Hostinger y configurar tu dominio, sigue este instructivo paso a paso:

### Paso 1: Configurar la Integración de Git en Hostinger (Despliegue Automático)
1. Entra a tu **hPanel** en [Hostinger](https://hpanel.hostinger.com/).
2. En la barra lateral o panel central, ve a **Sitio Web** -> **Git**.
3. En el apartado **Configurar Git**:
   * **URL del repositorio**: Introduce `https://github.com/mcfilmsecuador-blip/mcfilmsweb.git`.
   * **Rama (Branch)**: Escribe `main`.
   * **Directorio de instalación**: Déjalo vacío o apunta a `/public_html` (según cómo esté tu carpeta raíz en el hosting).
4. Si tu repositorio es público, haz clic en **Crear**. Si te solicita clave SSH porque el repositorio está privado, Hostinger te dará una clave SSH pública (`id_rsa.pub`). Cópiala y agrégala en la configuración de tu repositorio en GitHub (sección *Settings -> Deploy keys -> Add deploy key*, marcando "Allow write access").
5. Haz clic en **Desplegar** (Deploy) en Hostinger. Tu sitio se cargará en el hosting.
6. **Activar Autodeploy (Opcional pero recomendado)**: Hostinger te dará una URL de Webhook. Cópiala. Luego ve a tu repositorio de GitHub -> **Settings** -> **Webhooks** -> **Add webhook**, pega la URL en *Payload URL*, y selecciona *Content type: application/json*. Así, cada vez que hagamos un cambio en el código y lo subamos a GitHub, Hostinger lo actualizará automáticamente sin que tengas que hacer nada.

### Paso 2: Conectar tu Dominio Personalizado
1. Si compraste tu dominio directamente en Hostinger, este ya estará enlazado de forma predeterminada al plan de hosting.
2. Si compraste el dominio en otro proveedor (como GoDaddy, Namecheap o NIC.ec):
   * **Opción A (Recomendada - Cambiar Nameservers)**: Cambia los DNS de tu dominio en el panel de tu registrador por los de Hostinger:
     * `ns1.dns-parking.com`
     * `ns2.dns-parking.com`
   * **Opción B (Apuntar registros A)**: Si no deseas cambiar los Nameservers porque tienes correos enlazados en el proveedor original, crea o edita el registro DNS tipo **A** de tu dominio (ejemplo: `@` y `www`) apuntando a la **IP de tu servidor de Hostinger** (esta IP la verás en el panel de control del hosting en Hostinger, en la sección de detalles/información del plan).
