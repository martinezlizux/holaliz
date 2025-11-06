#!/usr/bin/env bash
set -euo pipefail

# Simple bulk converter: JPG -> WEBP using ffmpeg
# Converts files under images/projects/ and images/playground/

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required but not installed. Install it (brew install ffmpeg) and re-run."
  exit 1
fi

# find target files (jpg/jpeg)
files=(images/projects/*.jpg images/projects/*.jpeg images/projects/*@2x.jpg images/playground/*.jpg images/playground/*@2x.jpg)

shopt -s nullglob
for f in "${files[@]}"; do
  # skip if not a file
  [ -f "$f" ] || continue
  out="${f%.*}.webp"
  echo "Converting: $f -> $out"
  # use libwebp encoder via ffmpeg; tune -qscale:v (0..100 where lower is better quality for some encoders)
  ffmpeg -y -i "$f" -vcodec libwebp -lossless 0 -qscale:v 70 -preset default "$out"
done

echo "WEBP generation complete."
