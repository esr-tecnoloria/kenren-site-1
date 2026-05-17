// Helpers to map an original GCS image URL to the resized variants produced by
// the storage-resize-images Firebase Extension.
//
// Extension config:
//   IMG_BUCKET = kenren-media
//   IMG_SIZES = 400x400, 800x800, 1600x1600
//   IMG_TYPE = webp
//   RESIZED_IMAGES_PATH = resized
//
// Source object:  gs://kenren-media/news/foo.png
// Resized object: gs://kenren-media/resized/news/foo_400x400.webp
//
// Public URL: https://storage.googleapis.com/kenren-media/resized/news/foo_400x400.webp

const BUCKET_BASE = 'https://storage.googleapis.com/kenren-media/';
const RESIZED_PREFIX = 'resized/';
const SIZES = [400, 800, 1600];

function parseGcsUrl(url) {
  if (!url || !url.startsWith(BUCKET_BASE)) return null;
  const path = url.slice(BUCKET_BASE.length); // e.g. news/foo.png
  const lastSlash = path.lastIndexOf('/');
  const dir = lastSlash >= 0 ? path.slice(0, lastSlash + 1) : '';
  const file = lastSlash >= 0 ? path.slice(lastSlash + 1) : path;
  const dotIdx = file.lastIndexOf('.');
  const base = dotIdx > 0 ? file.slice(0, dotIdx) : file;
  return { dir, base };
}

export function resizedUrl(url, size) {
  const parsed = parseGcsUrl(url);
  if (!parsed) return url;
  return `${BUCKET_BASE}${RESIZED_PREFIX}${parsed.dir}${parsed.base}_${size}x${size}.webp`;
}

/** Build a srcset string for the configured sizes. */
export function resizedSrcSet(url) {
  const parsed = parseGcsUrl(url);
  if (!parsed) return undefined;
  return SIZES.map(s => `${resizedUrl(url, s)} ${s}w`).join(', ');
}
