#!/bin/bash
# Usage:
#   bash _public/api/test-api.sh [--server=<url>]
#
# Arguments:
#   --server=<url> : (optional) API server URL (default: http://localhost:3011)
#
# Examples:
#   bash _public/api/test-api.sh
#   bash _public/api/test-api.sh --server=http://192.168.0.10:3011

SERVER="http://localhost:3011"

for arg in "$@"; do
  case $arg in
    --server=*) SERVER="${arg#*=}" ;;
  esac
done

PASS=0
FAIL=0
TOTAL=0

run_test() {
  local name="$1"
  local expected_code="$2"
  local actual_code="$3"
  local body="$4"
  TOTAL=$((TOTAL + 1))

  if [ "$actual_code" = "$expected_code" ]; then
    echo "  ✅ #${TOTAL} ${name} (HTTP ${actual_code})"
    PASS=$((PASS + 1))
  else
    echo "  ❌ #${TOTAL} ${name} (expected ${expected_code}, got ${actual_code})"
    [ -n "$body" ] && echo "     Body: ${body}"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== fBanner API Test ==="
echo "Server: ${SERVER}"
echo ""

# --- Test 1: Health Check (GET /) ---
echo "[1] Health Check"
RESP=$(curl -s -w "\n%{http_code}" "${SERVER}/")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "GET / returns 200" "200" "$HTTP_CODE" "$BODY"

# Check response contains "fBanner"
if echo "$BODY" | grep -q "fBanner"; then
  TOTAL=$((TOTAL + 1)); PASS=$((PASS + 1))
  echo "  ✅ #${TOTAL} Response contains 'fBanner'"
else
  TOTAL=$((TOTAL + 1)); FAIL=$((FAIL + 1))
  echo "  ❌ #${TOTAL} Response missing 'fBanner'"
fi
echo ""

# --- Test 2: Application Status (GET /api/status) ---
echo "[2] Application Status"
RESP=$(curl -s -w "\n%{http_code}" "${SERVER}/api/status")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "GET /api/status returns 200" "200" "$HTTP_CODE" "$BODY"
echo ""

# --- Test 3: Get Config (GET /api/config) ---
echo "[3] Get Configuration"
RESP=$(curl -s -w "\n%{http_code}" "${SERVER}/api/config")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "GET /api/config returns 200" "200" "$HTTP_CODE" "$BODY"
echo ""

# --- Test 4: Update Config (PUT /api/config) ---
echo "[4] Update Configuration"
RESP=$(curl -s -w "\n%{http_code}" -X PUT "${SERVER}/api/config" \
  -H "Content-Type: application/json" \
  -d '{"rows": 3, "cols": 4}')
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "PUT /api/config returns 200" "200" "$HTTP_CODE" "$BODY"
echo ""

# --- Test 5: Load File (POST /api/load) with invalid path ---
echo "[5] Load File (invalid path)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "${SERVER}/api/load" \
  -H "Content-Type: application/json" \
  -d '{"path": "/nonexistent/file.png"}')
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "POST /api/load with invalid path returns 400" "400" "$HTTP_CODE" "$BODY"
echo ""

# --- Test 6: Export without file loaded (POST /api/export) ---
echo "[6] Export (no file loaded)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "${SERVER}/api/export" \
  -H "Content-Type: application/json" \
  -d '{"outputDir": "/tmp/output"}')
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "POST /api/export without file returns 409" "409" "$HTTP_CODE" "$BODY"
echo ""

# --- Test 7: 404 Not Found ---
echo "[7] 404 Not Found"
RESP=$(curl -s -w "\n%{http_code}" "${SERVER}/nonexistent")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "GET /nonexistent returns 404" "404" "$HTTP_CODE" "$BODY"
echo ""

# --- Test 8: Load + Export with test image (if resource exists) ---
TEST_IMG=""
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

for ext in png jpg jpeg; do
  FOUND=$(find "${PROJECT_ROOT}/_public/resource/contents" -name "*.${ext}" -type f 2>/dev/null | head -1)
  if [ -n "$FOUND" ]; then
    TEST_IMG="$FOUND"
    break
  fi
done

if [ -n "$TEST_IMG" ]; then
  echo "[8] Load + Export (integration)"
  OUTPUT_DIR=$(mktemp -d)

  # Load
  RESP=$(curl -s -w "\n%{http_code}" -X POST "${SERVER}/api/load" \
    -H "Content-Type: application/json" \
    -d "{\"path\": \"${TEST_IMG}\"}")
  HTTP_CODE=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | sed '$d')
  run_test "POST /api/load with test image returns 200" "200" "$HTTP_CODE" "$BODY"

  # Export
  RESP=$(curl -s -w "\n%{http_code}" -X POST "${SERVER}/api/export" \
    -H "Content-Type: application/json" \
    -d "{\"outputDir\": \"${OUTPUT_DIR}\"}")
  HTTP_CODE=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | sed '$d')
  run_test "POST /api/export returns 200" "200" "$HTTP_CODE" "$BODY"

  # Check files created
  FILE_COUNT=$(find "$OUTPUT_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
  if [ "$FILE_COUNT" -gt 0 ]; then
    TOTAL=$((TOTAL + 1)); PASS=$((PASS + 1))
    echo "  ✅ #${TOTAL} Exported ${FILE_COUNT} files to ${OUTPUT_DIR}"
  else
    TOTAL=$((TOTAL + 1)); FAIL=$((FAIL + 1))
    echo "  ❌ #${TOTAL} No files exported"
  fi

  rm -rf "$OUTPUT_DIR"
  echo ""

  # --- Test 9: One-step split ---
  echo "[9] One-Step Split"
  OUTPUT_DIR=$(mktemp -d)
  RESP=$(curl -s -w "\n%{http_code}" -X POST "${SERVER}/api/split" \
    -H "Content-Type: application/json" \
    -d "{\"path\": \"${TEST_IMG}\", \"outputDir\": \"${OUTPUT_DIR}\", \"rows\": 2, \"cols\": 2}")
  HTTP_CODE=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | sed '$d')
  run_test "POST /api/split returns 200" "200" "$HTTP_CODE" "$BODY"

  FILE_COUNT=$(find "$OUTPUT_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
  if [ "$FILE_COUNT" -eq 4 ]; then
    TOTAL=$((TOTAL + 1)); PASS=$((PASS + 1))
    echo "  ✅ #${TOTAL} Split produced 4 files (2x2)"
  else
    TOTAL=$((TOTAL + 1)); FAIL=$((FAIL + 1))
    echo "  ❌ #${TOTAL} Expected 4 files, got ${FILE_COUNT}"
  fi

  rm -rf "$OUTPUT_DIR"
  echo ""
else
  echo "[8-9] Skipped: no test image found in _public/resource/contents/"
  echo ""
fi

# --- Summary ---
echo "=== Result: ${PASS}/${TOTAL} passed, ${FAIL} failed ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
