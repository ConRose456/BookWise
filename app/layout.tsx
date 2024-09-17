import "@cloudscape-design/global-styles/index.css";
import "./globals.css";

export const metadata = {
  title: 'BookWise',
  description: 'BookWise',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
  
