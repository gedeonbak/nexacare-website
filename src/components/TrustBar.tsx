import { Layers, ShieldCheck, FileText, Zap, DollarSign } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Layers,      text: "HIPAA-Compliant AWS Stack" },
  { icon: ShieldCheck, text: "CPOM-Reviewed · GA · FL · TX" },
  { icon: FileText,    text: "MSA Templates · Healthcare Counsel" },
  { icon: Zap,         text: "Twilio CarePath · 937× SMS ROI" },
  { icon: DollarSign,  text: "$6,200/mo Burn · 83pt Breakeven" },
];

export default function TrustBar() {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 48px",
        display: "flex",
        alignItems: "center",
        gap: "48px",
        background: "rgba(255,255,255,0.02)",
        overflowX: "auto",
      }}
    >
      <span
        className="hidden sm:block"
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Infrastructure
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "40px",
        }}
      >
        {TRUST_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Icon size={16} strokeWidth={1.5} style={{ opacity: 0.35 }} />
              {item.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
