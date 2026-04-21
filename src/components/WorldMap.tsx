"use client";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

type Props = {
  children?: React.ReactNode;
  onClick?: (coords: [number, number]) => void;
  className?: string;
};

export default function WorldMap({ children, onClick, className }: Props) {
  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 175 }}
      width={820}
      height={400}
      className={className}
      style={{ width: "100%", height: "auto", cursor: onClick ? "crosshair" : "default" }}
    >
      <Geographies geography="/world-110m.json">
        {({ geographies, projection }) => (
          <>
            {/* Clickable invisible backdrop for placing pins */}
            {onClick && (
              <rect
                x={-10000}
                y={-10000}
                width={20000}
                height={20000}
                fill="transparent"
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
                  },
                  hover: {
                    fill: "rgba(255,255,255,0.06)",
                    stroke: "rgba(255,255,255,0.2)",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  pressed: {
                    fill: "rgba(255,255,255,0.06)",
                    outline: "none",
                  },
                }}
              />
            ))}
            {children}
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
}
