import { useState, useMemo, useCallback, useRef } from 'react';
import japanGeoJson from '../assets/map/japan-prefectures.geo.json';

// ─── Region definitions for Japanese prefectures ─────────────────────────────
const REGIONS = {
  hokkaido: { color: '#64B5F6', prefectures: ['hokkaido'] },
  tohoku:   { color: '#2E7D32', prefectures: ['aomori','iwate','miyagi','akita','yamagata','fukushima'] },
  kanto:    { color: '#81C784', prefectures: ['ibaraki','tochigi','gunma','saitama','chiba','tokyo','kanagawa'] },
  chubu:    { color: '#FFD54F', prefectures: ['niigata','toyama','ishikawa','fukui','yamanashi','nagano','gifu','shizuoka','aichi'] },
  kinki:    { color: '#FF9800', prefectures: ['mie','shiga','kyoto','osaka','hyogo','nara','wakayama'] },
  chugoku:  { color: '#EF5350', prefectures: ['tottori','shimane','okayama','hiroshima','yamaguchi'] },
  shikoku:  { color: '#F48FB1', prefectures: ['tokushima','kagawa','ehime','kochi'] },
  kyushu:   { color: '#9C27B0', prefectures: ['fukuoka','saga','nagasaki','kumamoto','oita','miyazaki','kagoshima','okinawa'] },
};

/** Map each prefecture code → its region key */
const prefToRegion = {};
for (const [region, { prefectures }] of Object.entries(REGIONS)) {
  for (const p of prefectures) prefToRegion[p] = region;
}

// Prefectures rendered as inset (geographically distant from main islands)
const INSET_PREFECTURES = new Set(['okinawa']);

// ─── Lightweight Mercator projection ─────────────────────────────────────────

/** Convert a [lon, lat] to raw Mercator [x, y] (both in degree-equivalent units) */
function toMercator(lon, lat) {
  const x = lon;
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const latRad = (clampedLat * Math.PI) / 180;
  // Multiply by 180/π so y is in the same scale as x (degrees)
  const y = Math.log(Math.tan(Math.PI / 4 + latRad / 2)) * (180 / Math.PI);
  return [x, y];
}

/**
 * Build a projection function that maps [lon, lat] → [svgX, svgY].
 * excludeCodes: set of prefecture codes to exclude from bounding box calc.
 */
function buildProjection(geojson, width, height, padding = 20, excludeCodes = new Set()) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const feature of geojson.features) {
    if (excludeCodes.has(feature.properties.code)) continue;
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

  const scale = Math.min(availWidth / mercatorWidth, availHeight / mercatorHeight);

  const offsetX = padding + (availWidth - mercatorWidth * scale) / 2;
  const offsetY = padding + (availHeight - mercatorHeight * scale) / 2;

  return function project(lon, lat) {
    const [mx, my] = toMercator(lon, lat);
    const svgX = (mx - minX) * scale + offsetX;
    const svgY = (maxY - my) * scale + offsetY;
    return [svgX, svgY];
  };
}

// ─── Convert GeoJSON geometry → SVG path "d" string ─────────────────────────

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
  let largestRing = null;
  let maxPoints = 0;

  for (const polygon of geometry.coordinates) {
    const ring = polygon[0];
    if (ring.length > maxPoints) {
      maxPoints = ring.length;
      largestRing = ring;
    }
  }

  if (!largestRing) return [0, 0];

  let cx = 0, cy = 0;
  for (const [lon, lat] of largestRing) {
    const [x, y] = project(lon, lat);
    cx += x;
    cy += y;
  }
  return [cx / largestRing.length, cy / largestRing.length];
}

/**
 * Compute bounding box of a geometry after projection.
 */
function computeBBox(geometry, project) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const polygon of geometry.coordinates) {
    for (const ring of polygon) {
      for (const [lon, lat] of ring) {
        const [x, y] = project(lon, lat);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

// ─── SVG dimensions ─────────────────────────────────────────────────────────
const SVG_WIDTH = 800;
const SVG_HEIGHT = 1200;

// Okinawa inset: position and scale in the SVG
const INSET_X = 30;
const INSET_Y = 950;
const INSET_BOX_W = 140;
const INSET_BOX_H = 180;
const INSET_PADDING = 12;

// ─── JapanMap Component ─────────────────────────────────────────────────────

export default function JapanMap({ onStateSelect, selectedState: controlledSelected, activeRegion = 'all', prefectureData = {} }) {
  const [internalSelected, setInternalSelected] = useState(null);
  const selectedState = controlledSelected !== undefined ? controlledSelected : internalSelected;

  const [hoveredState, setHoveredState] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, name: '', kanji: '' });
  const svgRef = useRef(null);

  // Build projection for main islands (excluding inset prefectures from bounds)
  const project = useMemo(
    () => buildProjection(japanGeoJson, SVG_WIDTH, SVG_HEIGHT, 20, INSET_PREFECTURES),
    []
  );

  // Build a separate projection for inset prefectures
  const insetProject = useMemo(() => {
    // Create a mini GeoJSON with only inset features
    const insetFeatures = japanGeoJson.features.filter(f => INSET_PREFECTURES.has(f.properties.code));
    if (insetFeatures.length === 0) return null;

    const insetGeoJson = { type: 'FeatureCollection', features: insetFeatures };
    return buildProjection(
      insetGeoJson,
      INSET_BOX_W,
      INSET_BOX_H,
      INSET_PADDING
    );
  }, []);

  // Pre-compute all path data and centroids
  const prefShapes = useMemo(() => {
    return japanGeoJson.features.map((feature) => {
      const { name, code, region } = feature.properties;
      const isInset = INSET_PREFECTURES.has(code);
      const proj = isInset ? insetProject : project;
      const pathD = geometryToPath(feature.geometry, proj);
      const [cx, cy] = computeCentroid(feature.geometry, proj);
      const regionColor = REGIONS[region]?.color || '#666';
      const prefData = prefectureData[code];
      const kanji = prefData?.kanji || '';

      return { code, name, kanji, pathD, cx, cy, region, regionColor, isInset };
    });
  }, [project, insetProject, prefectureData]);

  // Split into main and inset shapes
  const mainShapes = useMemo(() => prefShapes.filter(s => !s.isInset), [prefShapes]);
  const insetShapes = useMemo(() => prefShapes.filter(s => s.isInset), [prefShapes]);

  const handleStateClick = useCallback((code) => {
    const newSelection = code === selectedState ? null : code;
    setInternalSelected(newSelection);
    onStateSelect?.(newSelection);
  }, [selectedState, onStateSelect]);

  const handleMouseMove = useCallback((e, code, name, kanji) => {
    setHoveredState(code);
    setTooltip({
      visible: true,
      x: e.clientX + 14,
      y: e.clientY + 14,
      name,
      kanji,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredState(null);
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const renderPrefecture = ({ code, name, kanji, pathD, region, regionColor }) => {
    const isSelected = selectedState === code;
    const isHovered = hoveredState === code;
    const isDimmed = activeRegion !== 'all' && region !== activeRegion;

    return (
      <path
        key={code}
        d={pathD}
        className={[
          'pref-polygon',
          isSelected && 'active',
          isHovered && 'hovered',
          isDimmed && 'dimmed',
        ].filter(Boolean).join(' ')}
        fill={regionColor}
        stroke="#fff"
        strokeWidth={isSelected ? 3.5 : 2}
        strokeLinejoin="round"
        onClick={() => handleStateClick(code)}
        onMouseMove={(e) => handleMouseMove(e, code, name, kanji)}
        onMouseLeave={handleMouseLeave}
        data-pref={code}
      />
    );
  };

  const renderLabel = ({ code, kanji, cx, cy }) => (
    <text
      key={`label-${code}`}
      x={cx}
      y={cy}
      className="pref-label"
      textAnchor="middle"
      dominantBaseline="central"
      pointerEvents="none"
    >
      {kanji}
    </text>
  );

  return (
    <div className="japan-map-container">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="japan-svg-map"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main island prefectures */}
        {mainShapes.map(renderPrefecture)}
        {mainShapes.map(renderLabel)}

        {/* Okinawa inset */}
        {insetShapes.length > 0 && (
          <g transform={`translate(${INSET_X}, ${INSET_Y})`}>
            {/* Inset box background */}
            <rect
              x={0}
              y={0}
              width={INSET_BOX_W}
              height={INSET_BOX_H}
              fill="none"
              stroke="#ccc"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              rx={8}
              ry={8}
            />
            {insetShapes.map(renderPrefecture)}
            {insetShapes.map(renderLabel)}
          </g>
        )}
      </svg>

      {/* Floating tooltip */}
      {tooltip.visible && (
        <div
          className="map-tooltip"
          style={{
            display: 'block',
            left: tooltip.x + 'px',
            top: tooltip.y + 'px',
          }}
        >
          {tooltip.name}<span className="tooltip-kanji">{tooltip.kanji}</span>
        </div>
      )}
    </div>
  );
}
