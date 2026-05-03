import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div
      style={{ backgroundColor: "#262262" }}
      className="w-full py-[10px] px-4 text-center"
    >
      <p className="text-white text-[12px] font-medium">
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
