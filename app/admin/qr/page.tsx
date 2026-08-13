import { redirect } from "next/navigation";

export default function LegacyQrPage() {
  redirect("/generate");
}
