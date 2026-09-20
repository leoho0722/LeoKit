#!/usr/bin/env bash
#
# 判斷這次變更該跑哪些 CI job，把結果寫進 $GITHUB_OUTPUT。
#
# 分流規則（由上往下第一個命中者為準）：
#   *.md                   純文件，不算進任何範圍
#   ios/、Package.swift    ios —— manifest 得放在根目錄，但它屬於 iOS 套件
#   android/               android
#   web/                   web
#   其他                   全跑（tokens/、.github/、根目錄設定檔…）
#
# 只要有任何非文件變更就跑 tokens job：產生器會寫進三端，
# 只改單一平台也可能把 *.generated.* 改歪，那道 git diff --exit-code 一定要在。
#
# 認不出比對範圍時（第一次推分支、force push、淺 clone）一律全跑。
# 這支的失誤成本不對稱：多跑只是浪費 runner，漏跑會讓壞掉的 commit 進 main。

set -euo pipefail

: "${GITHUB_OUTPUT:=/dev/stdout}"

tokens=false
ios=false
android=false
web=false

emit() {
    {
        printf 'tokens=%s\n' "$tokens"
        printf 'ios=%s\n' "$ios"
        printf 'android=%s\n' "$android"
        printf 'web=%s\n' "$web"
    } >> "$GITHUB_OUTPUT"

    printf '變更範圍：tokens=%s ios=%s android=%s web=%s\n' \
        "$tokens" "$ios" "$android" "$web"
}

run_everything() {
    printf '::notice::%s，這次所有 job 都跑\n' "$1"
    tokens=true
    ios=true
    android=true
    web=true
    emit
    exit 0
}

base="${BASE_SHA:-}"
head="${HEAD_SHA:-}"

if [ -z "$base" ] || [ "$base" = "0000000000000000000000000000000000000000" ]; then
    run_everything "拿不到可比對的 base commit"
fi

if ! git cat-file -e "${base}^{commit}" 2>/dev/null \
    || ! git cat-file -e "${head}^{commit}" 2>/dev/null; then
    run_everything "base 或 head commit 不在這份 clone 裡"
fi

if ! merge_base=$(git merge-base "$base" "$head" 2>/dev/null); then
    run_everything "$base 與 $head 沒有共同祖先"
fi

# --no-renames：搬檔案要讓來源與目的地兩邊的範圍都跑到，
# 開著更名偵測的話 --name-only 只會印出新路徑。
files=$(git diff --no-renames --name-only "$merge_base" "$head")

printf '這次變更的檔案：\n%s\n' "$files"

while IFS= read -r file; do
    [ -n "$file" ] || continue
    case "$file" in
        *.md)                continue ;;
        ios/*|Package.swift) ios=true ;;
        android/*)           android=true ;;
        web/*)               web=true ;;
        *)                   ios=true; android=true; web=true ;;
    esac
    tokens=true
done <<< "$files"

emit
