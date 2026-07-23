# Carpeta de imágenes

Todo lo que ves en el sitio ahora mismo son **placeholders generados automáticamente**. Reemplázalos por tus archivos reales sin tocar el HTML — solo respeta el nombre de archivo (o cambia la ruta en `index.html` si prefieres otro nombre).

## `logos/` — Logo real de la marca
Logo oficial de Elevator Labs, usado en el navbar, el footer y el favicon del sitio.

| Archivo | Uso |
|---|---|
| `icono.svg` | Ícono "EA" solo (sin texto), fondo transparente. Usado como `.brand-mark` en navbar/footer y como favicon SVG. Funciona sobre fondo claro y oscuro. |
| `logo-negro.svg` | Lockup completo (ícono + "ELEVATOR LABS") en negro, fondo transparente. Para usar sobre fondos claros. |
| `logo-labs-blanco.svg` | Lockup completo a color (ícono + texto), pensado para fondos oscuros. |
| `logo-blanco.svg` | Lockup completo en blanco sobre tarjeta negra (fondo opaco incluido). Pensado para uso standalone (redes, presentaciones), no para incrustar sobre otros fondos. |

`assets/images/logo.svg` y `assets/images/favicon.ico` quedan como respaldo/fallback pero ya no son la referencia principal.

## `logos/` (uso anterior) — Logos de clientes / partners
Si en el futuro reactivas la sección de "Marcas que ya elevaron su producto con nosotros" (actualmente comentada en `index.html`), usa esta misma carpeta para `logo-1.svg` … `logo-6.svg`, uno por archivo, SVG o PNG con fondo transparente, altura ~32–40px.

## `tech/` — Stack tecnológico
Usados en el carrusel infinito ("Tecnologías con las que construimos"). Son los logos oficiales de cada marca (obtenidos de tech-stack-icons.com).

| Archivo | Tecnología |
|---|---|
| `react.svg` | React |
| `nextjs.svg` | Next.js |
| `nodejs.svg` | Node.js |
| `typescript.svg` | TypeScript |
| `dotnet.svg` | .NET |
| `csharp.svg` | C# |
| `flutter.svg` | Flutter |
| `aws.svg` | AWS |
| `postgresql.svg` | PostgreSQL |
| `figma.svg` | Figma |
| `docker.svg` | Docker |
| `anthropic.svg` | Anthropic |
| `openai.svg` | OpenAI |
| `gemini.svg` | Gemini |
| `azure.svg` | Azure |
| `bitbucket.svg` | Bitbucket |
| `github.svg` | GitHub |
| `django.svg` | Django |
| `docusaurus.svg` | Docusaurus |
| `grafana.svg` | Grafana |
| `mongodb.svg` | MongoDB |
| `opencv.svg` | OpenCV |
| `oracle.svg` | Oracle |
| `render.svg` | Render |
| `tensorflow.svg` | TensorFlow |
| `spark.svg` | Apache Spark (icon.icepanel.io / devicon) |
| `n8n.svg` | n8n |
| `airflow.svg` | Apache Airflow (icon.icepanel.io / devicon) |

- Para agregar o quitar tecnologías: edita el bloque `.tech-chip` en `index.html` — hay una copia idéntica marcada `aria-hidden="true"` para el loop infinito del carrusel; actualízala también.

## `portfolio/` — Proyectos destacados
Usadas en la sección "Proyectos".

| Archivo | Uso |
|---|---|
| `project-1.svg` … `project-6.svg` | Una imagen/mockup por proyecto |

- Formato recomendado: **JPG o PNG**, relación de aspecto ~4:5 (vertical), mínimo 800×1000px.
- Si usas JPG/PNG en vez de SVG, actualiza la extensión en `index.html` (`<img src="assets/images/portfolio/project-1.jpg" ...>`).

## `team/` — Fotos de clientes en testimonios
| Archivo | Uso |
|---|---|
| `client-1.svg` … `client-3.svg` | Foto circular junto a cada testimonio |

- Formato recomendado: foto cuadrada, mínimo 160×160px.

## Reemplazo rápido
1. Exporta tu imagen con el mismo nombre de archivo (o cambia el `src` en `index.html`).
2. Arrastra el archivo a la carpeta correspondiente, sobrescribiendo el placeholder.
3. Recarga el navegador — no hay build step, los cambios se ven al instante.
