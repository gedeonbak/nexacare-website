import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div
      style={{
        backgroundColor: "rgba(39,170,225,0.12)",
        borderBottom: "1px solid rgba(39,170,225,0.2)",
      }}
      className="w-full py-[10px] px-4 text-center"
    >
      <p
        className="text-[12px] font-medium"
        style={{ color: "rgba(255,255,255,0.8)" }}
      >
        NexaCare is now accepting pilot clinic applications in GA, FL, and TX —{" "}
        <Link
          href="/book-demo"
          className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: "#27AAE1" }}
        >
          Apply for the pilot →
        </Link>
      </p>
    </div>
  );
}
