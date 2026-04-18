import { EXPORT_CSS } from '../data/exportCss.js'
import { EXPORT_RUNTIME } from '../data/exportRuntime.js'

export function buildExportHtml(funnel: any, serverOrigin: string): string {
  const metaTitle = funnel.settings?.metaTitle || funnel.title
  const metaDesc = funnel.settings?.metaDescription || funnel.description || ''
  const branding = funnel.branding || {}

  const fontFamily = branding.fontFamily || 'Inter'
  const googleFontLink = fontFamily !== 'system'
    ? `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700&display=swap" rel="stylesheet" />`
    : ''

  const funnelJson = JSON.stringify(funnel).replace(/<\/script>/gi, '<\\/script>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(metaTitle)}</title>
  <meta name="description" content="${escapeHtml(metaDesc)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  ${googleFontLink}
  <style>
${EXPORT_CSS}
  </style>
</head>
<body>
  <div id="funnel-root"></div>
  <script>
    window.__FUNNEL__ = ${funnelJson};
    window.__CONFIG__ = {
      submitEndpoint: "${serverOrigin}/api/submit/${funnel.slug}",
      analyticsEndpoint: "${serverOrigin}/api/analytics",
      funnelId: "${funnel.id}"
    };
  </script>
  <script>
${EXPORT_RUNTIME}
  </script>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
