# LeoKit

一份語意 token 來源，三種原生實作。

LeoKit 不追求 iOS、Android、Web 三端長得一模一樣，而是讓三端看起來出自同一個人之手、
用起來卻各自符合平台慣例。設計系統的完整說明（品牌書、跨平台指引、每個元件的使用規則）
在 Design System artifact 裡；這個 repo 是它的三份實作。

```
LeoKit/
├── Package.swift          Swift Package 的 manifest（SwiftPM 規定要在根目錄）
├── tokens/                唯一真實來源與產生器
│   ├── tokens.json        設計 token，與 Design System artifact 同步
│   ├── platform-map.json  字級對 iOS / Android 原生字級的對應
│   └── generate.mjs       產生四份 token 檔
├── apple/                 iOS 26，SwiftUI
├── android/               minSdk 31，Compose + Material 3
├── web/                   npm 套件，無框架依賴的 DOM 工廠
└── .devcontainer/         Node + JDK + Android SDK + Swift 的開發容器
```

## Token 怎麼流動

`tokens/tokens.json` 是唯一真實來源。`node tokens/generate.mjs` 會產生：

| 產出 | 內容 |
| --- | --- |
| `apple/Sources/LeoKit/Tokens/LK<型別>.generated.swift` | 一型別一檔：`LKColorValues`（原始值）、`LKColor`、`LKSpacing`、`LKRadius`、`LKSize`、`LKOpacity`、`LKFont` |
| `android/.../tokens/LK<主題>.generated.kt` | 依 Kotlin 慣例分三檔：`LKColorScheme`（含淺色／深色 scheme）、`LKMetrics`（`LKSpacing`、`LKRadius`、`LKSize`、`LKOpacity`）、`LKTypography` |
| `web/src/tokens.generated.css` | CSS 自訂屬性與字級 class |
| `web/src/tokens.generated.ts` | 型別化的 token 物件 |

產生器是確定性的：同樣的輸入永遠產生同樣的位元組，所以 CI 用 `git diff --exit-code`
檢查有沒有人改了 token 卻忘了重跑。**不要手動編輯任何 `*.generated.*`。**

字級的平台對應（`body` 在 iOS 是 `.body`、在 Android 是 `bodyLarge`）放在
`tokens/platform-map.json`，這樣 `tokens.json` 可以與 artifact 保持逐位元組同步、不加欄位。

## 範圍

三個套件都實作了完整的 token 層，以及設計系統定義的全部 27 個元件：

AppBar、Avatar、Badge、Banner、Button、Card、Checkbox、Chip、Combobox、Dialog、
EmptyState、ListRow、Menu、PickerField、Progress、Radio、SegmentedControl、Sheet、
Slider、Stepper、TabBar、Table、Tabs、TextField、Tip、Toast、Toggle。

元件語意與名稱三端一致，實作各自原生 —— 原生已有對等元件的一律薄包裝，不自繪。
所以同一個元件在三端的形狀可能不同，這是刻意的：

| 元件 | iOS | Android | Web |
| --- | --- | --- | --- |
| Toggle | 系統 `Toggle` | `Switch` | `.lk-toggle`（`role="switch"`） |
| SegmentedControl | `Picker(.segmented)` | `SingleChoiceSegmentedButtonRow` | `.lk-seg` |
| Dialog | `lkConfirmation()` 包 `.alert` | `AlertDialog` | `.lk-dialog` |
| AppBar | `lkAppBar()` 修飾子，列由 `NavigationStack` 提供 | `TopAppBar` | `.lk-appbar` |
| Toast | 自繪 overlay | `LKToastHost` 包 `SnackbarHost` | `.lk-toast` |
| Tip | `lkTipAppearance()`，規則交給 TipKit | 自繪 + `lkTipShouldShow()` | `tipShouldShow()` |
| Combobox | `.searchable` 全螢幕清單 | 展開的 `SearchBar` | 下拉面板 |
| Radio | 列尾打勾（iOS 原生形狀） | `RadioButton` | 圓圈 |

Tip 的規則欄位（`id`、`maxDisplays`）三端刻意一致，這樣「哪些提示、什麼時候出現」
可以寫成一份跨平台的清單；狀態各自存 TipKit、DataStore 與 `localStorage`。

兩個刻意的相依決定：Android 的 `LKAvatar` 用圖片插槽而不是內建圖片載入器
（由 App 傳入自己的 Coil 或 Glide），`LKTip` 的狀態也交給 App 的 DataStore —— 
函式庫不替使用者選這兩個相依。

## 開發

一律在開發容器內編譯與測試：

```bash
# VS Code：Reopen in Container
cd web     && npm run build && npm test
cd android && ./gradlew :leokit:assembleRelease :leokit:test
swift package describe          # Apple：只驗證 manifest
```

**Apple 的套件無法在 Linux 容器內編譯** —— 它用 SwiftUI，而 Linux 上沒有 SwiftUI。
容器內能做的是 `swift package describe`（驗證 manifest 與來源路徑）與 `swiftc -parse`（語法檢查）；
真正的 build 與測試要在 macOS + Xcode，CI 裡跑在 `macos-26` runner 上。
在 Mac 上要用 `xcodebuild` 指定 iOS destination，不能用 `swift build`（理由見 `apple/README.md`）。

## 安裝

### Swift Package

GitHub Packages 沒有 Swift registry，SwiftPM 直接從 git 解析：

```swift
.package(url: "https://github.com/leoho0722/LeoKit.git", from: "0.1.0")
```

### Android

```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        maven("https://maven.pkg.github.com/leoho0722/LeoKit") {
            credentials {
                username = providers.gradleProperty("gpr.user").orNull
                password = providers.gradleProperty("gpr.token").orNull   // 需要 read:packages
            }
        }
    }
}

// build.gradle.kts
implementation("io.github.leoho0722:leokit:0.1.0")
```

### Web

```bash
echo "@leoho0722:registry=https://npm.pkg.github.com" >> .npmrc
npm install @leoho0722/leokit
```

## 發佈

打上 `vX.Y.Z` 的 tag，`publish` workflow 會：把 npm 套件發到 GitHub Packages、
把 AAR 發到 GitHub Packages 的 Maven、並為 Swift Package 建立 GitHub Release。
workflow 會檢查 tag 與 `web/package.json`、`android/gradle.properties` 的版本一致，不一致就中止。

## 授權

MIT，見 [LICENSE](LICENSE)。
