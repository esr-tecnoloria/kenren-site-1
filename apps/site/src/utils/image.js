// Helpers to map an original GCS image URL to the resized variants produced by
// the storage-resize-images Firebase Extension.
//
// Source object:  gs://kenren-media/news/foo.png
// Resized object: gs://kenren-media/news/resized/foo_400x400.png
// (the extension puts variants in a `resized/` subfolder next to the original,
// preserving the original extension)

const BUCKET_BASE = 'https://storage.googleapis.com/kenren-media/';
const SIZES = [400, 800, 1600];

function parseGcsUrl(url) {
  if (!url || !url.startsWith(BUCKET_BASE)) return null;
  const path = url.slice(BUCKET_BASE.length);
  const lastSlash = path.lastIndexOf('/');
  const dir = lastSlash >= 0 ? path.slice(0, lastSlash + 1) : '';
  const file = lastSlash >= 0 ? path.slice(lastSlash + 1) : path;
  const dotIdx = file.lastIndexOf('.');
  const base = dotIdx > 0 ? file.slice(0, dotIdx) : file;
  const ext = dotIdx > 0 ? file.slice(dotIdx) : '';
  return { dir, base, ext };
}

export function resizedUrl(url, size) {
  const parsed = parseGcsUrl(url);
  if (!parsed) return url;
  return `${BUCKET_BASE}${parsed.dir}resized/${parsed.base}_${size}x${size}${parsed.ext}`;
}

/** Build a srcset string for the configured sizes. */
export function resizedSrcSet(url) {
  const parsed = parseGcsUrl(url);
  if (!parsed) return undefined;
  return SIZES.map(s => `${resizedUrl(url, s)} ${s}w`).join(', ');
}
