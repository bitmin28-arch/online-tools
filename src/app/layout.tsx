import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "./components/theme-toggle";

export const metadata: Metadata = {
  title: {
    default: "TurnTurnTurn — Free Online Tools",
    template: "%s | TurnTurnTurn",
  },
  description:
    "Free online tools for image compression, PDF manipulation, JSON formatting, QR code generation, and more. No upload needed — everything runs in your browser.",
  keywords: [
    "online tools",
    "image compressor",
    "pdf merge",
    "json formatter",
    "qr code generator",
    "base64",
    "free tools",
  ],
  robots: "index, follow",
};

/**
 * Google Fonts: Inter (正文) + JetBrains Mono (代码)
 * 通过 link 标签引入，减少构建复杂度
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0TLNTPKM7Q" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-0TLNTPKM7Q');`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="header">
          <div className="header-inner">
            <a href="/" className="logo">
              <span className="logo-icon">⚡</span>
              TurnTurnTurn
            </a>
            <nav>
              <ul className="header-nav">
                <li>
                  <a href="#image-tools">Image</a>
                </li>
                <li>
                  <a href="#pdf-tools">PDF</a>
                </li>
                <li>
                  <a href="#dev-tools">Developer</a>
                </li>
                <li>
                  <a href="#text-tools">Text</a>
                </li>
              </ul>
            </nav>
            <ThemeToggle />
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            <p>© 2025 TurnTurnTurn. All tools run locally in your browser — your files never leave your device.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
