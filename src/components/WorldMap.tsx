"use client";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

type Props = {
  children?: React.ReactNode;
  onClick?: (coords: [number, number]) => void;
  className?: string;
  /** Set of canonical Natural Earth country names to highlight. */
  highlighted?: Set<string>;
};

const W = 820;
const H = 410;

const VISITED_FILL = "rgba(34, 211, 238, 0.22)";
const VISITED_FILL_HOVER = "rgba(34, 211, 238, 0.32)";
const VISITED_STROKE = "rgba(34, 211, 238, 0.55)";

export default function WorldMap({ children, onClick, highlighted, className }: Props) {
  return (
    <ComposableMap
      projection="geoEquirectangular"
      projectionConfig={{ scale: 130, center: [0, 0] }}
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
            {geographies.map((geo) => {
              const name = (geo.properties?.name ?? "") as string;
              const isVisited = highlighted?.has(name) ?? false;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: isVisited ? VISITED_FILL : "rgba(255,255,255,0.04)",
                      stroke: isVisited ? VISITED_STROKE : "rgba(255,255,255,0.14)",
                      strokeWidth: isVisited ? 0.6 : 0.4,
                      outline: "none",
                      pointerEvents: onClick ? "none" : undefined,
                      transition: "fill 200ms ease, stroke 200ms ease",
                    },
                    hover: {
                      fill: isVisited ? VISITED_FILL_HOVER : "rgba(255,255,255,0.06)",
                      stroke: isVisited ? VISITED_STROKE : "rgba(255,255,255,0.2)",
                      strokeWidth: isVisited ? 0.7 : 0.5,
                      outline: "none",
                      pointerEvents: onClick ? "none" : undefined,
                    },
                    pressed: {
                      fill: isVisited ? VISITED_FILL_HOVER : "rgba(255,255,255,0.06)",
                      outline: "none",
                      pointerEvents: onClick ? "none" : undefined,
                    },
                  }}
                />
              );
            })}
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
