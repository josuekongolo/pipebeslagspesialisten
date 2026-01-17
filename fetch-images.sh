#!/bin/bash

# Freepik API Image Fetcher for Pipebeslagspesialisten AS
API_KEY="FPSX16ea10a2ecf0f342b45d9a1ad35dde33"
BASE_DIR="/Users/josuekongolo/Downloads/nettsider/bygg/Gruppe3/pipebeslagspesialisten/images"

# Function to search and download image
fetch_image() {
    local search_term="$1"
    local output_path="$2"
    local output_name="$3"

    echo "Searching for: $search_term"

    # URL encode the search term
    encoded_term=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$search_term'))")

    # Search for images
    search_result=$(curl -s -X GET "https://api.freepik.com/v1/resources?locale=en-US&page=1&limit=5&order=relevance&term=${encoded_term}" \
        -H "x-freepik-api-key: $API_KEY" \
        -H "Accept: application/json")

    # Extract first image ID using python
    image_id=$(echo "$search_result" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['data'][0]['id'] if data.get('data') else '')" 2>/dev/null)

    if [ -z "$image_id" ]; then
        echo "  No images found for: $search_term"
        return 1
    fi

    echo "  Found image ID: $image_id"

    # Get download URL
    download_result=$(curl -s -X GET "https://api.freepik.com/v1/resources/${image_id}/download" \
        -H "x-freepik-api-key: $API_KEY" \
        -H "Accept: application/json")

    # Extract download URL
    download_url=$(echo "$download_result" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('data', {}).get('url', ''))" 2>/dev/null)

    if [ -z "$download_url" ]; then
        echo "  Could not get download URL"
        return 1
    fi

    echo "  Downloading to: ${output_path}/${output_name}"
    mkdir -p "$output_path"
    curl -s -L "$download_url" -o "${output_path}/${output_name}"

    if [ -f "${output_path}/${output_name}" ] && [ -s "${output_path}/${output_name}" ]; then
        echo "  Downloaded successfully!"
        return 0
    else
        echo "  Download failed"
        return 1
    fi
}

echo "=============================================="
echo "Fetching images for Pipebeslagspesialisten AS"
echo "=============================================="
echo ""

# === HERO IMAGES (2) ===
echo "=== HERO IMAGES ==="
echo "[1/13] Hero Background - Pipe Flashing"
fetch_image "chimney flashing roof metal installation" "$BASE_DIR/hero" "hero-bg.jpg"
echo ""

echo "[2/13] Hero Image Right - Roofing Work"
fetch_image "roofer metal work chimney professional" "$BASE_DIR/hero" "hero-image.jpg"
echo ""

# === SERVICE IMAGES (7) ===
echo "=== SERVICE IMAGES ==="
echo "[3/13] Heldekkende Pipebeslag (Complete Pipe Flashing)"
fetch_image "chimney flashing metal roof professional" "$BASE_DIR/services" "pipebeslag.jpg"
echo ""

echo "[4/13] Reparasjon (Repair)"
fetch_image "roof repair chimney maintenance" "$BASE_DIR/services" "reparasjon.jpg"
echo ""

echo "[5/13] Pipehatter (Pipe Caps)"
fetch_image "chimney cap metal roof top" "$BASE_DIR/services" "pipehatter.jpg"
echo ""

echo "[6/13] Fotbeslag (Base Flashing)"
fetch_image "roof flashing metal installation base" "$BASE_DIR/services" "fotbeslag.jpg"
echo ""

echo "[7/13] Takrenner (Gutters)"
fetch_image "roof gutter metal installation house" "$BASE_DIR/services" "takrenner.jpg"
echo ""

echo "[8/13] Takhatter (Roof Ventilation)"
fetch_image "roof vent metal ventilation hat" "$BASE_DIR/services" "takhatter.jpg"
echo ""

echo "[9/13] Beslag på Mål (Custom Fittings)"
fetch_image "metal sheet bending custom fabrication" "$BASE_DIR/services" "beslag-maal.jpg"
echo ""

# === ABOUT IMAGES (3) ===
echo "=== ABOUT IMAGES ==="
echo "[10/13] Professional Craftsmanship"
fetch_image "metal worker craftsman professional hands" "$BASE_DIR/about" "craftsmanship.jpg"
echo ""

echo "[11/13] Coastal Climate Rogaland"
fetch_image "norwegian coast stormy weather sea" "$BASE_DIR/about" "coastal-climate.jpg"
echo ""

echo "[12/13] Problem Solution Work"
fetch_image "roofer working chimney installation" "$BASE_DIR/services" "problem-solution.jpg"
echo ""

echo "[13/13] About Section Homepage"
fetch_image "professional roofer worker portrait" "$BASE_DIR/about" "about-home.jpg"
echo ""

echo "=============================================="
echo "Image fetching complete!"
echo "=============================================="

# List downloaded images
echo ""
echo "Downloaded images:"
find "$BASE_DIR" -name "*.jpg" -type f 2>/dev/null | while read f; do
    size=$(ls -lh "$f" | awk '{print $5}')
    echo "  $f ($size)"
done
