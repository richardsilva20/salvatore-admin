import "./globals.css";

export const metadata = {
  title: "Salvatore Admin",
  description: "Painel de Controle do Robô Salvatore",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
