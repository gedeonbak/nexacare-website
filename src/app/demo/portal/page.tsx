import type { Metadata } from "next";
import PortalDemo from "./PortalDemo";

export const metadata: Metadata = {
  title: "Platform Demo — NexaCare Management",
  description:
    "Interactive demo of the NexaCare CarePath platform — clinic portal and admin portal. Explore patient management, escalations, CarePath monitoring, and billing.",
};

export default function DemoPortalPage() {
  return <PortalDemo />;
}
