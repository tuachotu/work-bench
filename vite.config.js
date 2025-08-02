import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'vite.svg'],
      manifest: {
        name: 'work-bench.dev - Developer Tools',
        short_name: 'WorkBench',
        description: 'A terminal-inspired collection of developer tools for formatting, converting, and manipulating data. JSON formatter, UUID generator, string operations, and more.',
        theme_color: '#00ff88',
        background_color: '#0a0a0a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'any',
        categories: ['developer', 'utilities', 'productivity', 'tools'],
        lang: 'en-US',
        dir: 'ltr',
        launch_handler: {
          client_mode: 'navigate-existing'
        },
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ],
        shortcuts: [
          {
            name: 'JSON Formatter',
            short_name: 'JSON',
            description: 'Format and validate JSON data',
            url: '/json',
            icons: [{ src: 'icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'UUID Generator',
            short_name: 'UUID',
            description: 'Generate and validate UUIDs',
            url: '/generate/uuid',
            icons: [{ src: 'icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'String Operations',
            short_name: 'String',
            description: 'Manipulate and analyze strings',
            url: '/string/length',
            icons: [{ src: 'icon-192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
})