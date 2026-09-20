#!/usr/bin/env bash
# 容器建好後的一次性設定
set -euo pipefail

echo "→ 安裝 web 相依套件"
(cd web && npm ci || npm install)

echo "→ 指向容器內的 Android SDK"
printf 'sdk.dir=%s\n' "${ANDROID_HOME}" > android/local.properties

echo "→ 產生 token（順便確認產生器可以跑）"
node tokens/generate.mjs

cat <<'EOF'

LeoKit 開發容器就緒。

  web     ： cd web && npm run build && npm test
  android ： cd android && ./gradlew :leokit:assembleRelease :leokit:test
  apple   ： swift package describe        # 只驗證 manifest
             swiftc -parse apple/Sources/LeoKit/**/*.swift
             真正的編譯要在 macOS + Xcode，容器內沒有 SwiftUI。

  改 token： 編輯 tokens/tokens.json，然後 node tokens/generate.mjs
EOF
