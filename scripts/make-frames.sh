#!/usr/bin/env bash
# Видеоноос canvas-д зориулсан WebP кадрын дараалал гаргана.
# Хэрэглээ:  ./scripts/make-frames.sh <оролтын-видео.mp4> <scene-нэр> [fps]
# Жишээ:     ./scripts/make-frames.sh public/media/raw/1-noos.mp4 scene1 24
#
# Гаралт:
#   public/frames/<scene>/desktop/0001.webp ... + manifest.json  (1280px өргөн)
#   public/frames/<scene>/mobile/0001.webp  ... + manifest.json  (9:16, 720x1280)
set -euo pipefail

IN="${1:?оролтын видео заана уу}"
SCENE="${2:?scene нэр заана уу}"
FPS="${3:-24}"
OUT="public/frames/${SCENE}"

make_variant () {
  local variant="$1" vf="$2" quality="$3"
  local dir="${OUT}/${variant}"
  rm -rf "$dir" && mkdir -p "$dir"
  ffmpeg -loglevel error -y -i "$IN" -an \
    -vf "fps=${FPS},${vf}" \
    -c:v libwebp -quality "$quality" -compression_level 6 \
    "${dir}/%04d.webp"
  local count
  count=$(find "$dir" -name '*.webp' | wc -l | tr -d ' ')
  local size
  size=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height \
    -of csv=p=0:s=x "${dir}/0001.webp")
  local w="${size%x*}" h="${size#*x}"
  printf '{"count":%s,"width":%s,"height":%s,"ext":"webp"}\n' "$count" "$w" "$h" > "${dir}/manifest.json"
  echo "${variant}: ${count} кадр, ${w}x${h}, $(du -sh "$dir" | cut -f1)"
}

# Desktop: 1280px өргөн
make_variant desktop "scale=1280:-2:flags=lanczos" 72
# Mobile: төвөөс 9:16 тайрч 720x1280 (босоо дэлгэцэнд бүдгэрэхгүй)
make_variant mobile "crop=min(iw\,ih*9/16):ih,scale=720:-2:flags=lanczos" 68
