const EPSILON = 0.000001;

export function createPoint(x, y) {
  return {
    x: Number(x),
    y: Number(y)
  };
}

export function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function polygonArea(points) {
  if (!Array.isArray(points) || points.length < 3) {
    return 0;
  }

  let sum = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    sum += current.x * next.y - next.x * current.y;
  }

  return Math.abs(sum) / 2;
}

export function signedPolygonArea(points) {
  if (!Array.isArray(points) || points.length < 3) {
    return 0;
  }

  let sum = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    sum += current.x * next.y - next.x * current.y;
  }

  return sum / 2;
}

export function polygonPerimeter(points) {
  if (!Array.isArray(points) || points.length < 2) {
    return 0;
  }

  let perimeter = 0;
  for (let index = 0; index < points.length; index += 1) {
    perimeter += distance(points[index], points[(index + 1) % points.length]);
  }
  return perimeter;
}

export function polygonBounds(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0
    };
  }

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

export function polygonCentroid(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return createPoint(0, 0);
  }

  const area = signedPolygonArea(points);
  if (Math.abs(area) < EPSILON) {
    const totals = points.reduce(
      (accumulator, point) => ({
        x: accumulator.x + point.x,
        y: accumulator.y + point.y
      }),
      { x: 0, y: 0 }
    );
    return createPoint(totals.x / points.length, totals.y / points.length);
  }

  let cx = 0;
  let cy = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const cross = current.x * next.y - next.x * current.y;
    cx += (current.x + next.x) * cross;
    cy += (current.y + next.y) * cross;
  }

  return createPoint(cx / (6 * area), cy / (6 * area));
}

export function sanitizePolygon(points) {
  if (!Array.isArray(points)) {
    return [];
  }

  const sanitized = [];
  for (const point of points) {
    if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) {
      continue;
    }

    const next = createPoint(point.x, point.y);
    const previous = sanitized.at(-1);
    if (!previous || distance(previous, next) > 0.001) {
      sanitized.push(next);
    }
  }

  if (sanitized.length > 1 && distance(sanitized[0], sanitized.at(-1)) <= 0.001) {
    sanitized.pop();
  }

  return sanitized;
}

export function isSimplePolygon(points) {
  const polygon = sanitizePolygon(points);
  if (polygon.length < 3) {
    return false;
  }

  for (let firstIndex = 0; firstIndex < polygon.length; firstIndex += 1) {
    const firstNext = (firstIndex + 1) % polygon.length;
    for (let secondIndex = firstIndex + 1; secondIndex < polygon.length; secondIndex += 1) {
      const secondNext = (secondIndex + 1) % polygon.length;

      if (
        firstIndex === secondIndex ||
        firstNext === secondIndex ||
        secondNext === firstIndex
      ) {
        continue;
      }

      if (
        segmentsIntersect(
          polygon[firstIndex],
          polygon[firstNext],
          polygon[secondIndex],
          polygon[secondNext]
        )
      ) {
        return false;
      }
    }
  }

  return true;
}

export function validatePolygon(points, options = {}) {
  const minArea = options.minArea ?? 0.25;
  const polygon = sanitizePolygon(points);
  const issues = [];

  if (polygon.length < 3) {
    issues.push("A room needs at least 3 points.");
  }

  const area = polygonArea(polygon);
  if (area < minArea) {
    issues.push(`Room area must be at least ${minArea} square meters.`);
  }

  if (polygon.length >= 3 && !isSimplePolygon(polygon)) {
    issues.push("Room outline cannot cross itself.");
  }

  return {
    isValid: issues.length === 0,
    issues,
    points: polygon,
    area,
    perimeter: polygonPerimeter(polygon),
    bounds: polygonBounds(polygon),
    centroid: polygonCentroid(polygon)
  };
}

export function roundNumber(value, digits = 3) {
  const scale = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * scale) / scale;
}

function orientation(a, b, c) {
  const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (Math.abs(value) < EPSILON) {
    return 0;
  }
  return value > 0 ? 1 : 2;
}

function pointOnSegment(point, start, end) {
  return (
    point.x <= Math.max(start.x, end.x) + EPSILON &&
    point.x >= Math.min(start.x, end.x) - EPSILON &&
    point.y <= Math.max(start.y, end.y) + EPSILON &&
    point.y >= Math.min(start.y, end.y) - EPSILON
  );
}

function segmentsIntersect(a, b, c, d) {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  return (
    (o1 === 0 && pointOnSegment(c, a, b)) ||
    (o2 === 0 && pointOnSegment(d, a, b)) ||
    (o3 === 0 && pointOnSegment(a, c, d)) ||
    (o4 === 0 && pointOnSegment(b, c, d))
  );
}
