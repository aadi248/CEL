import { Header } from "@/components/Header";
import { AdminPanel } from "@/components/AdminPanel";

export default function AdminPage() {
  return (
    <main className="shell">
      <Header />
      <section style={{ padding: "34px 0" }}>
        <div className="kicker">HIDDEN ROUTE</div>
        <h1 className="display-title">CONTROL ROOM.</h1>
        <AdminPanel />
      </section>
    </main>
  );
}
