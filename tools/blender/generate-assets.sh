#!/bin/sh
set -eu

if [ -n "${BLENDER_BIN:-}" ]; then
  city_blender="$BLENDER_BIN"
elif [ -x "/Applications/Blender-3.6.app/Contents/MacOS/Blender" ]; then
  city_blender="/Applications/Blender-3.6.app/Contents/MacOS/Blender"
else
  city_blender="blender"
fi

"$city_blender" --factory-startup --background \
  --python tools/blender/generate_city_assets.py
