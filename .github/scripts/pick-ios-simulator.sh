#!/usr/bin/env bash
#
# 挑一台可用的 iOS 模擬器，把它的 UDID 印到 stdout。
#
# 為什麼需要這支：
#   LeoKit 只支援 iOS，而 `swift build` 一律編給 host（在 CI 上就是 macOS），
#   於是會在 LKColorValue.swift 的 `import UIKit` 直接爆 "no such module 'UIKit'"。
#   要編 iOS 只能走 xcodebuild 並指定 destination，
#   而 `xcodebuild test` 的 destination 必須是具體的機器，不能用 generic。
#
# 挑法：
#   取版本號最大、且底下真的有裝置的 iOS runtime，再取它的第一台裝置。
#   版號用數值比大小而不是字典序，機型名稱一概不寫死 ——
#   Apple 換世代或改名都不會讓 CI 壞掉。

set -euo pipefail

udid=$(xcrun simctl list devices available --json | jq -r '
  .devices
  | to_entries
  | map(select((.key | test("SimRuntime\\.iOS")) and (.value | length > 0)))
  | sort_by(
      .key
      | capture("iOS-(?<major>[0-9]+)-(?<minor>[0-9]+)")
      | [(.major | tonumber), (.minor | tonumber)]
    )
  | last
  | .value[0].udid
')

if [ -z "$udid" ] || [ "$udid" = "null" ]; then
    echo "找不到任何可用的 iOS 模擬器，以下是這台 runner 實際有的：" >&2
    xcrun simctl list devices available >&2
    exit 1
fi

printf '%s\n' "$udid"
