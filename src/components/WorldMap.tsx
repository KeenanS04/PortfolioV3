"use client";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

type Props = {
  children?: React.ReactNode;
  onClick?: (coords: [number, number]) => void;
  className?: string;
};

const W = 820;
const H = 380;

export default function WorldMap({ children, onClick, className }: Props) {
  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 170, center: [0, 10] }}
      width={W}
      height={H}
      className={className}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        cursor: onClick ? "crosshair" : "default",
      }}
    >
      <Geographies geography="/world-110m.json">
        {({ geographies, projection }) => (
          <>
            {geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "rgba(255,255,255,0.04)",
                    stroke: "rgba(255,255,255,0.14)",
                    strokeWidth: 0.4,
                    outline: "none",
                    pointerEvents: onClick ? "none" : undefined,
                  },
                  hover: {
                    fill: "rgba(255,255,255,0.06)",
                    stroke: "rgba(255,255,255,0.2)",
                    strokeWidth: 0.5,
                    outline: "none",
                    pointerEvents: onClick ? "none" : undefined,
                  },
                  pressed: {
                    fill: "rgba(255,255,255,0.06)",
                    outline: "none",
                    pointerEvents: onClick ? "none" : undefined,
                  },
                }}
              />
            ))}
            {onClick && (
              <rect
                x={0}
                y={0}
                width={W}
                height={H}
                fill="transparent"
                style={{ pointerEvents: "all" }}
                onClick={(e) => {
                  const svg = (e.target as SVGElement).ownerSVGElement;
                  if (!svg) return;
                  const pt = svg.createSVGPoint();
                  pt.x = e.clientX;
                  pt.y = e.clientY;
                  const ctm = svg.getScreenCTM();
                  if (!ctm) return;
                  const local = pt.matrixTransform(ctm.inverse());
                  const inv = projection.invert?.([local.x, local.y]);
                  if (inv) onClick([inv[0], inv[1]]);
                }}
              />
            )}
            {children}
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
}
