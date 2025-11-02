#!/usr/bin/env bash
# generate-posters.sh
#
# Extracts a poster frame for each .mp4 in images/playground.
# Requires: ffmpeg (recommended). On macOS, sips is used for optional resizing.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PLAYGROUND_DIR="$ROOT_DIR/images/playground"

if [ ! -d "$PLAYGROUND_DIR" ]; then
  echo "Playground directory not found: $PLAYGROUND_DIR"
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required but it's not installed."
  echo "Install ffmpeg (e.g. on macOS: brew install ffmpeg) and re-run this script."
  exit 1
fi

echo "Generating posters for mp4 files in: $PLAYGROUND_DIR"

shopt -s nullglob
for f in "$PLAYGROUND_DIR"/*.mp4; do
  base=$(basename "$f" .mp4)
  tmp_poster="$PLAYGROUND_DIR/${base}-poster-tmp.jpg"
  poster="$PLAYGROUND_DIR/${base}-poster.jpg"

  echo "Processing: $f -> $poster"

  # extract a frame ~1s into the video (safer than 0s)
  ffmpeg -y -ss 00:00:01 -i "$f" -frames:v 1 -q:v 2 "$tmp_poster"

  # Prefer to resize with sips on macOS to a reasonable size (800px max) while keeping center crop optional
  if command -v sips >/dev/null 2>&1; then
    # Resize to fit within 1200px (preserve aspect), then save as poster
    sips -Z 1200 "$tmp_poster" --out "$poster" >/dev/null
    rm -f "$tmp_poster"
  else
    # fallback: use ffmpeg to scale width to 1200px preserving aspect ratio
    ffmpeg -y -i "$tmp_poster" -vf "scale=1200:-1" "$poster"
    rm -f "$tmp_poster"
  fi

  echo "Created: $poster"
done

echo "All done. Add the generated posters to git if desired."
