import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "GameCodeHub";
  const subtitle = searchParams.get("subtitle") || "Daily Game Codes, Server Status & More";
  const game = searchParams.get("game") || "";

  const gameColors: Record<string, string> = {
    "genshin-impact": "#5B8AF5",
    "free-fire": "#FF6B35",
    "roblox": "#E2231A",
    "pubg-mobile": "#F2A900",
    "honkai-star-rail": "#7B68EE",
  };

  const accentColor = game ? gameColors[game] || "#2563eb" : "#2563eb";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, ${accentColor}22 100%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            GC
          </div>
          <span style={{ color: "#94a3b8", fontSize: "24px", fontWeight: 600 }}>
            GameCodeHub
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "900px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              marginTop: "16px",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#64748b",
            fontSize: "18px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
            }}
          />
          Updated Daily
        </div>

        {game && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              backgroundColor: accentColor,
            }}
          />
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
