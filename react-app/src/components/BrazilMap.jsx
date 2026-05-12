import { useState, useMemo, useCallback, useRef } from 'react';
import brazilGeoJson from '../data/brazil-states.geo.json';

// ─── Region definitions for Brazilian states ────────────────────────────────
const REGIONS = {
  Norte:        { color: '#2E7D32', states: ['AC','AM','AP','PA','RO','RR','TO'] },
  Nordeste:     { color: '#1565C0', states: ['AL','BA','CE','MA','PB','PE','PI','RN','SE'] },
  'Centro-Oeste': { color: '#FFC107', states: ['DF','GO','MS','MT'] },
  Sudeste:      { color: '#FF5722', states: ['ES','MG','RJ','SP'] },
  Sul:          { color: '#9C27B0', states: ['PR','RS','SC'] },
};

/** Map each state abbreviation → its region name */
const stateToRegion = {};
for (const [region, { states }] of Object.entries(REGIONS)) {
  for (const s of states) stateToRegion[s] = region;
}

// ─── Lightweight Mercator projection ─────────────────────────────────────────
//
// Instead of pulling in d3-geo, we use a simple equirectangular-to-Mercator
// transform. The core idea:
//   x = longitude  (linear)
//   y = ln(tan(π/4 + lat/2))  (Mercator formula — stretches poles)
//
// We compute the bounding box of all coordinates first, then scale/translate
// so the map fits inside [0, viewWidth] × [0, viewHeight].
//

/** Convert a [lon, lat] to raw Mercator [x, y] */
function toMercator(lon, lat) {
  const x = lon;
  // Clamp latitude to avoid infinity at poles
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const latRad = (clampedLat * Math.PI) / 180;
  const y = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  return [x, y];
}

/**
 * Build a projection function that maps [lon, lat] → [svgX, svgY].
 *
 * Steps:
 *   1. Convert every coordinate to raw Mercator to find the bounding box.
 *   2. Compute scale so the map fits inside (width × height) with padding.
 *   3. Return a function that projects any [lon, lat] to SVG pixel coords.
 */
function buildProjection(geojson, width, height, padding = 20) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  // Scan all coordinates to find Mercator-space bounding box
  for (const feature of geojson.features) {
    for (const polygon of feature.geometry.coordinates) {
      for (const ring of polygon) {
        for (const [lon, lat] of ring) {
          const [mx, my] = toMercator(lon, lat);
          if (mx < minX) minX = mx;
          if (mx > maxX) maxX = mx;
          if (my < minY) minY = my;
          if (my > maxY) maxY = my;
        }
      }
    }
  }

  const mercatorWidth = maxX - minX;
  const mercatorHeight = maxY - minY;
  const availWidth = width - padding * 2;
  const availHeight = height - padding * 2;

  // Use the smaller scale so the map fits entirely
  const scale = Math.min(availWidth / mercatorWidth, availHeight / mercatorHeight);

  // Center the map in the available space
  const offsetX = padding + (availWidth - mercatorWidth * scale) / 2;
  const offsetY = padding + (availHeight - mercatorHeight * scale) / 2;

  return function project(lon, lat) {
    const [mx, my] = toMercator(lon, lat);
    // Flip Y because SVG y-axis points down, but Mercator y increases upward
    const svgX = (mx - minX) * scale + offsetX;
    const svgY = (maxY - my) * scale + offsetY;
    return [svgX, svgY];
  };
}

// ─── Convert GeoJSON geometry → SVG path "d" string ─────────────────────────
//
// A MultiPolygon has: coordinates[polygon][ring][point]
//   - ring[0] is the outer boundary
//   - ring[1..n] are holes (if any)
//
// For SVG we convert each ring into:  M x0,y0 L x1,y1 ... Z
//

function geometryToPath(geometry, project) {
  const parts = [];

  for (const polygon of geometry.coordinates) {
    for (const ring of polygon) {
      if (ring.length < 3) continue;
      const projected = ring.map(([lon, lat]) => project(lon, lat));
      const [startX, startY] = projected[0];
      let d = `M${startX.toFixed(1)},${startY.toFixed(1)}`;
      for (let i = 1; i < projected.length; i++) {
        d += `L${projected[i][0].toFixed(1)},${projected[i][1].toFixed(1)}`;
      }
      d += 'Z';
      parts.push(d);
    }
  }

  return parts.join('');
}

// ─── Compute label position (centroid of the largest polygon ring) ──────────

function computeCentroid(geometry, project) {
  // Find the ring with the most points (main shape, skip islands)
  let largestRing = null;
  let maxPoints = 0;

  for (const polygon of geometry.coordinates) {
    const ring = polygon[0]; // outer boundary
    if (ring.length > maxPoints) {
      maxPoints = ring.length;
      largestRing = ring;
    }
  }

  if (!largestRing) return [0, 0];

  // Simple average centroid
  let cx = 0, cy = 0;
  for (const [lon, lat] of largestRing) {
    const [x, y] = project(lon, lat);
    cx += x;
    cy += y;
  }
  return [cx / largestRing.length, cy / largestRing.length];
}

// ─── SVG dimensions ─────────────────────────────────────────────────────────
const SVG_WIDTH = 600;
const SVG_HEIGHT = 700;

// ─── BrazilMap Component ─────────────────────────────────────────────────────

export default function BrazilMap({ onStateSelect, selectedState: controlledSelected }) {
  // Support both controlled (via props) and uncontrolled (internal state) modes
  const [internalSelected, setInternalSelected] = useState(null);
  const selectedState = controlledSelected !== undefined ? controlledSelected : internalSelected;

  const [hoveredState, setHoveredState] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, name: '', sigla: '' });
  const svgRef = useRef(null);

  // Build projection once — memoize so it doesn't recompute on re-renders
  const project = useMemo(
    () => buildProjection(brazilGeoJson, SVG_WIDTH, SVG_HEIGHT),
    []
  );

  // Pre-compute all path data and centroids — expensive work done once
  const stateShapes = useMemo(() => {
    return brazilGeoJson.features.map((feature) => {
      const { name, sigla } = feature.properties;
      const pathD = geometryToPath(feature.geometry, project);
      const [cx, cy] = computeCentroid(feature.geometry, project);
      const region = stateToRegion[sigla] || '';
      const regionColor = REGIONS[region]?.color || '#666';

      return { sigla, name, pathD, cx, cy, region, regionColor };
    });
  }, [project]);

  const handleStateClick = useCallback((sigla) => {
    const newSelection = sigla === selectedState ? null : sigla;
    setInternalSelected(newSelection);
    onStateSelect?.(newSelection);
  }, [selectedState, onStateSelect]);

  const handleMouseMove = useCallback((e, sigla, name) => {
    setHoveredState(sigla);
    setTooltip({
      visible: true,
      x: e.clientX + 14,
      y: e.clientY + 14,
      name,
      sigla,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredState(null);
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <div className="brazil-map-container">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="brazil-svg-map"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Render each state as its own <path> */}
        {stateShapes.map(({ sigla, name, pathD, regionColor }) => {
          const isSelected = selectedState === sigla;
          const isHovered = hoveredState === sigla;
          const isDimmed = selectedState && !isSelected;

          return (
            <path
              key={sigla}
              d={pathD}
              className={[
                'brazil-state-path',
                isSelected && 'selected',
                isHovered && 'hovered',
                isDimmed && 'dimmed',
              ].filter(Boolean).join(' ')}
              fill={isSelected ? '#FFD54F' : regionColor}
              stroke="#fff"
              strokeWidth={isSelected ? 2 : 1}
              onClick={() => handleStateClick(sigla)}
              onMouseMove={(e) => handleMouseMove(e, sigla, name)}
              onMouseLeave={handleMouseLeave}
              data-state={sigla}
            />
          );
        })}

        {/* State abbreviation labels */}
        {stateShapes.map(({ sigla, cx, cy }) => (
          <text
            key={`label-${sigla}`}
            x={cx}
            y={cy}
            className="brazil-state-label"
            textAnchor="middle"
            dominantBaseline="central"
            pointerEvents="none"
          >
            {sigla}
          </text>
        ))}
      </svg>

      {/* Floating tooltip */}
      {tooltip.visible && (
        <div
          className="brazil-map-tooltip"
          style={{
            left: tooltip.x + 'px',
            top: tooltip.y + 'px',
          }}
        >
          <strong>{tooltip.name}</strong>
          <span className="tooltip-sigla">{tooltip.sigla}</span>
        </div>
      )}
    </div>
  );
}
