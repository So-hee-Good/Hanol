import { redirect } from "next/navigation";

export default function SmsRedirectPage() {
  redirect("/messages");
}
