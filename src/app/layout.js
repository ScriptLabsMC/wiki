import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroBackground from './components/HeroBackground'
import { useSvgReplacement } from './hooks/useSvgReplacement'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
})

export const metadata = {
  title: {
    default: 'ScriptLabs — Innovación en Add-ons de Minecraft Bedrock',
    template: '%s | ScriptLabs'
  },
  description: 'Equipo de desarrolladores de Add-ons para Minecraft Bedrock. Herramientas, librerías y tutoriales para ayudarte a crear tus propios add-ons.',
  keywords: ['minecraft', 'bedrock', 'addons', 'scripts', 'tutoriales', 'herramientas', 'minecraft bedrock'],
  authors: [{ name: 'ScriptLabs Team' }],
  creator: 'ScriptLabs',
  publisher: 'ScriptLabs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://scriptlabsmc.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://scriptlabsmc.vercel.app',
    title: 'ScriptLabs — Innovación en Add-ons de Minecraft Bedrock',
    description: 'Equipo de desarrolladores de Add-ons para Minecraft Bedrock. Herramientas, librerías y tutoriales para ayudarte a crear tus propios add-ons.',
    siteName: 'ScriptLabs',
    images: [
      {
        url: '/assets/img/logo.png',
        width: 1200,
        height: 630,
        alt: 'ScriptLabs Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScriptLabs — Innovación en Add-ons de Minecraft Bedrock',
    description: 'Equipo de desarrolladores de Add-ons para Minecraft Bedrock.',
    creator: '@ajr_uribe'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'SlSXf_kb4xBiFHn_nZW2jLEJ9rSz20qwKeYZAHZIAOk'
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        
        {/* Theme Color */}
        <meta name="theme-color" content="#08FFC8" />
        <meta name="msapplication-TileColor" content="#08FFC8" />
        
        {/* Structured Data / Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ScriptLabs",
              "url": "https://scriptlabsmc.vercel.app",
              "description": "Equipo de desarrolladores de Add-ons para Minecraft Bedrock",
              "sameAs": [
                "https://youtube.com/@ScriptLabs",
                "https://discord.gg/BFG3T8MBWN"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <HeroBackground />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
	}
