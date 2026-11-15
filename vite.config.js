import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'رحلة الإنجليزية',
        short_name: 'رحلتي',
        description: 'منهج سنة لتعلم الإنجليزية: خطة يومية، مفردات Oxford بالتكرار المتباعد، مصادر، وتتبع اختبارات IELTS.',
        lang: 'ar', dir: 'rtl',
        start_url: '/', scope: '/', display: 'standalone', orientation: 'portrait',
        categories: ['education'],
        background_color: '#0e1a1f', theme_color: '#0b5d5a',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          { name: 'مراجعة المفردات', short_name: 'مراجعة', url: '/?tab=vocab', icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }] },
          { name: 'التقدم واختبارات IELTS', short_name: 'التقدم', url: '/?tab=prog', icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }] }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png}'] }
    })
  ]
})
