import type { Metadata } from "next";
import CarePathDemo from "./CarePathDemo";

export const metadata: Metadata = {
  title: "CarePath Demo — NexaCare Management",
  description:
    "Interactive simulation of CarePath — NexaCare's 90-day GLP-1 patient engagement system. See every message, patient reply, and risk trigger in real time.",
  openGraph: {
    title: "CarePath Demo — NexaCare Management",
    description:
      "Interactive simulation of CarePath — NexaCare's 90-day GLP-1 patient engagement system. See every message, patient reply, and risk trigger in real time.",
  },
};

export default function CarePathDemoPage() {
  return <CarePathDemo />;
}
