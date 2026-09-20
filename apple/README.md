# LeoKit — Apple

iOS 26，SwiftUI。

`Package.swift` 在 repo 根目錄，不在這個資料夾裡 —— SwiftPM 不支援從 git URL 解析子目錄裡的套件，
manifest 必須在根目錄。這裡只放原始碼，manifest 的 `path` 指過來。

## 用法

```swift
import LeoKit

struct SubscriptionRow: View {
    var body: some View {
        LKListRow("Netflix 標準方案", subtitle: "每月 3 日扣款", value: "NT$ 390", showsChevron: true)

        Button("新增訂閱") { }
            .buttonStyle(.lk(.primary))

        LKBanner("付款卡片已過期，下次扣款也會失敗。",
                  title: "Netflix 扣款失敗",
                  tone: .danger,
                  systemImage: "exclamationmark.triangle") {
            Button("更新付款方式") { }
        }
    }
}
```

## 慣例

- **字級一律綁 Dynamic Type。** `LKFont.body` 是 `Font.body`，不是寫死的 17pt。
  `tokens.json` 裡的 px 是 Web 值與設計稿參考值。
- **圓角一律 continuous。** `LKShape.lg` 是 `RoundedRectangle(cornerRadius:style:.continuous)`。
- **色彩是動態色。** `LKColor.brand` 由 `UIColor` 的 dynamic provider 建構，跟隨系統外觀。
  需要原始值（測試、工具）時讀 `LKColorValues`。
- **圖示用 SF Symbols。** 元件收 `systemImage: String`，不自帶圖示資產。

## 編譯

要 macOS + Xcode。Linux 容器裡沒有 SwiftUI，只能做 manifest 與語法驗證：

```bash
swift package describe
swiftc -parse apple/Sources/LeoKit/Tokens/*.swift
```
