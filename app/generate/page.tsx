import { Header } from "@/components/Header";
import { QrGenerator } from "@/components/QrGenerator";
import { appBaseUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function GeneratePage() {
  return (
    <main className="shell">
      <Header />
      <QrGenerator baseUrl={appBaseUrl().replace(/\/$/, "")} />
    </main>
  );
}
