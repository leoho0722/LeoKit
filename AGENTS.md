# LeoKit 開發規範

本檔案適用於整個 LeoKit repository。若未來在更深層目錄新增 `AGENTS.md`，以較深層檔案的規範為準。

## 專案概覽

LeoKit 是一套跨平台設計系統元件庫，提供三種原生實作：

- `apple/`：iOS 26、SwiftUI，套件 manifest 位於根目錄的 `Package.swift`。
- `android/`：minSdk 31、Compose + Material 3。
- `web/`：Node.js / TypeScript，無框架依賴的 DOM 工廠函式。
- `tokens/`：設計 token 的唯一真實來源與產生器。

三端的元件語意與名稱應保持一致，但外觀與互動要遵循各平台慣例。平台已有對等元件時，優先包裝平台元件，不要自行重繪。

設計系統定義的 27 個元件三端都已實作，新增元件等於三端都要補。`README.md` 的元件對照表記錄了刻意的形狀差異（Toggle、SegmentedControl、Dialog、AppBar、Toast、Tip、Combobox、Radio），改動任一端之前先查那張表，不要把刻意的差異當成 bug 修掉。

SwiftPM 無法從 git URL 解析子目錄裡的套件，所以 `Package.swift` 必須放在 repository 根目錄；原始碼仍在 `apple/`，由 target 的 `path` 指過去。兩者是同一個套件，不是兩套設定。

## Token 與產生檔

`tokens/tokens.json` 是唯一真實來源；`tokens/platform-map.json` 存放 iOS 與 Android 的字級對應。修改 token 後，從 repository 根目錄執行：

```bash
node tokens/generate.mjs
```

產生器會更新下列檔案：

- `apple/Sources/LeoKit/Tokens/*.generated.swift`
- `android/leokit/src/main/kotlin/io/github/leoho0722/leokit/tokens/*.generated.kt`
- `web/src/tokens.generated.css`
- `web/src/tokens.generated.ts`

不要手動編輯任何 `*.generated.*`。Token 變更必須把來源檔與產生結果一起提交；CI 會重新產生並以 `git diff --exit-code` 檢查結果是否過期。

### 為什麼有兩個來源檔

`tokens.json` 要與 Design System artifact 逐位元組同步，不能為了平台需求加欄位，所以字級對原生樣式的對應（`body` → iOS `.body`／Android `bodyLarge`）獨立放在 `platform-map.json`。新增或調整字級時兩個檔都要改。

### 產生器的保證

產生器會遞迴解析 `{brand}` 這類色彩別名並擋下成環、把每個色彩攤平成 light 與 dark 兩組值，輸出順序完全由來源檔的順序決定。這份確定性是 CI 能用 `git diff --exit-code` 當檢查的前提；修改產生器時不要引入非決定性的輸出，例如時間戳、未排序的集合或隨機 id。

### 產生檔與手寫檔的分界

- Apple：`LKColorValues.generated.swift` 是主題原始值表，`LKColor.generated.swift` 是畫面用的動態色；把原始值轉成動態 `Color` 的邏輯在手寫的 `LKColorValue.swift`，`LKShape.swift` 則把產生的 `LKRadius` 數值包成 continuous 的 `RoundedRectangle`。
- Android：產生 `LKColorScheme`、`LKMetrics`、`LKTypography` 三個檔；手寫的 `LKTheme.kt` 把它們組成主題，元件一律透過 `LKTheme.colors`／`.typography`／`.shapes` 取用，不要直接引用產生檔。
- Web：`tokens.generated.css` 提供自訂屬性與字級 class，手寫的 `leokit.css` 只消費這些變數、不寫死任何色值；`tokens.generated.ts` 是同一份資料的 TypeScript 型別化版本。

改色值動 `tokens.json`，改色彩行為動手寫檔。

### 修改 token 的動線

1. 改 `tokens/tokens.json`。
2. 新增或調整字級時一併補 `tokens/platform-map.json`。
3. 從 repository 根目錄執行 `node tokens/generate.mjs`。
4. 更新三端 token 測試的預期值：`apple/Tests/LeoKitTests/LKTokensTests.swift`、`android/leokit/src/test/kotlin/io/github/leoho0722/leokit/LKTokensTest.kt`、`web/test/tokens.test.mjs`。三份測的是同一組承諾 —— 產生器沒把值弄壞，以及設計系統承諾的對比度在該平台仍成立 —— 預期值是寫死的字面量（例如 `0x1E5FCC`），所以動到色彩 token 時三端通常要一起改。
5. 確認 `git diff` 只包含預期的來源檔與產生檔變更。

## 平台規範

### Apple

- 只支援 iOS 26；原始碼位於 `apple/Sources/LeoKit`，測試位於 `apple/Tests/LeoKitTests`。
- 字級使用 Dynamic Type，色彩使用動態色，圓角使用 continuous style；圖示使用 SF Symbols 字串，不在套件內攜帶圖示資產。
- 畫面使用 `LKColor`；測試或工具需要主題原始值時使用 `LKColorValues`。
- Linux 容器沒有 SwiftUI，只能驗證 manifest 與語法：

  ```bash
  swift package describe
  swiftc -parse apple/Sources/LeoKit/Tokens/*.swift
  ```

- 在 macOS 上不要用 `swift build` 編譯此套件，請指定 iOS destination：

  ```bash
  xcodebuild build -scheme LeoKit -destination 'generic/platform=iOS' CODE_SIGNING_ALLOWED=NO
  xcodebuild test -scheme LeoKit -destination "id=$(.github/scripts/pick-ios-simulator.sh)" CODE_SIGNING_ALLOWED=NO
  ```

- 測試使用 Swift Testing（`@Test`）。`xcodebuild test` 的 destination 必須是具體機器，不能用 generic；`.github/scripts/pick-ios-simulator.sh` 會挑一台可用的模擬器並印出 UDID。只跑單一測試：

  ```bash
  xcodebuild test -scheme LeoKit \
    -destination "id=$(.github/scripts/pick-ios-simulator.sh)" \
    -only-testing:LeoKitTests/LKTokensTests/colors_afterGeneration_matchSourceValues \
    CODE_SIGNING_ALLOWED=NO
  ```

### Android

- 使用 Compose + Material 3，公開 API 必須明確標註 `public`。
- AGP 9 已內建 Kotlin 支援，不要額外套用 `org.jetbrains.kotlin.android`。
- `-Xexplicit-api=strict` 也會套用到測試原始碼，因此測試裡的宣告同樣要標註 `public`。
- Kotlin 測試名稱可能含中文；執行測試時維持 UTF-8 locale（`LANG=C.UTF-8`）。
- `LKAvatar` 接受呼叫端提供的圖片內容，不替使用者選擇 Coil 或 Glide；`LKTip` 的狀態交由 App 的 DataStore 管理。
- 只跑單一測試時過濾到 class 層級即可；測試名稱是中文 backtick 函式名，用 method 名過濾很脆弱：

  ```bash
  LANG=C.UTF-8 ./gradlew :leokit:test --tests 'io.github.leoho0722.leokit.LKTokensTest' --no-daemon
  ```

  測試報告在 `android/leokit/build/reports/tests/`。

### Web

- 維持無框架設計；元件是回傳 `HTMLElement` 的工廠函式。
- CSS class 一律使用 `lk-` 前綴，並沿用 token 產生的字級 class。
- 元件必須保留可及性語意，包括適當的 HTML 元素、ARIA 名稱、鍵盤操作與可見 focus 狀態；不可只靠顏色表達狀態。
- 樣式分為 token CSS 與元件 CSS，修改或使用元件時確認兩者都被載入。
- 可及性名稱由型別強制：`WithAccessibleName<T>` 要求 `label` 與 `ariaLabel` 至少有一個，新的可互動元件請沿用它，不要自行定義選項型別。
- 測試從 `../dist/index.js` import，而且沒有 `pretest` hook。改完 `web/src` 必須先 `npm run build` 再 `npm test`，否則測到的是上一次建置的產物。
- 只跑單一檔案或單一測試：

  ```bash
  node --test test/tokens.test.mjs
  node --test --test-name-pattern 'Button：onClick' test/components.test.mjs
  ```

- 不要把 `web/dist/` 或其他建置輸出加入版本控制。

## 建置與測試

依修改範圍執行對應驗證；跨平台 token 或元件變更應盡量跑完整檢查。

```bash
# 根目錄：重新產生 token，並重現 CI 的過期檢查
node tokens/generate.mjs
git diff --exit-code

# Web（build 必須跑在 test 之前，測試吃的是 dist）
cd web
npm ci
npm run typecheck
npm run build
npm test

# Android
cd android
LANG=C.UTF-8 ./gradlew :leokit:assembleRelease :leokit:test --no-daemon

# Apple：Linux 容器可執行的檢查
cd ..
swift package describe
swiftc -parse apple/Sources/LeoKit/Tokens/*.swift
```

若只修改單一平台，至少執行該平台的 typecheck、build 與 test；若修改 `tokens/`，先重新產生檔案，再確認 `git diff` 只包含預期變更。

## 修改與提交注意事項

- 先辨認修改的是 token 來源、平台實作、測試或建置設定；不要直接修改產生結果來繞過來源流程。
- 跨平台新增或修改元件時，維持三端一致的語意、命名、狀態與可及性契約；具體視覺與互動可依平台原生慣例調整。
- 優先使用現有 token，不要在元件內新增未定義的色彩、間距、圓角或尺寸常數。
- 保持公開 API 的命名與既有元件風格一致；新增行為應補上對應平台的測試。
- 不要提交 `node_modules/`、`web/dist/`、Gradle/Xcode 建置輸出、`local.properties` 或其他已列於 `.gitignore` 的本機檔案。
- 發佈版本時，`web/package.json` 與 `android/gradle.properties` 的版本必須和 `vX.Y.Z` tag 一致；Apple 套件則透過 git tag 發佈。

## 交付前檢查

完成工作前確認：

1. 來源檔與產生檔已同步，且沒有手動修改產生檔。
2. 受影響平台的建置與測試已通過，或已清楚記錄無法執行的原因。
3. 沒有把建置產物、憑證、token 或本機設定檔加入變更。
4. `git diff` 內容只包含本次任務需要的修改。

## Commit 慣例

**只在使用者明確要求時才 commit，且絕不自行 push。** 使用者說「之後拆成兩個 commit」這類描述是在說明拆分方式，不是要求立刻執行。

### 格式

- 採用 [Conventional Commits](https://www.conventionalcommits.org/)：`<type>(<scope>): <標題>`。
- **標題用正體中文**，祈使語氣，不加句號；type 與 scope 保持英文小寫。
- scope 填主要變更範圍，例如 `apple`、`android`、`web`、`tokens` 或 `ci`；跨平台或 repository 層級的變更不填 scope。
- 常用 type：`feat` 新增元件或公開 API、`fix` 修正錯誤或違反元件契約的行為、`test` 新增或調整測試、`docs` README／開發文件、`build` 建置或產生流程、`ci` CI／發佈流程、`chore` 其他維護工作、`refactor` 重整結構但不改變語意。
- body 用列點，寫「為什麼改」與影響範圍；標題已足夠說明的小改動可省略 body。
- 使用 Claude Code 或 Codex 時，結尾保留 harness 當次注入的署名 trailer（例如 `Co-Authored-By`、`Claude-Session` 或 Codex 提供的對應欄位），逐字複製，不要自行改寫或省略；這些值每個 session 都不同，不得寫死在文件裡。

```text
feat(web): 加入 27 個元件與樣式層

- 新增元件工廠函式與對應樣式
- 沿用 token 產生的字級與色彩

Co-Authored-By: <harness 注入的模型署名>
Claude-Session: <harness 注入的 session URL>
```

若由 Codex 執行，沿用相同格式，並保留 Codex 當次注入的 trailer：

```text
fix(android): 補上元件可及性名稱

- 讓 TalkBack 能辨識控制項名稱
- 補上對應的 Compose 測試

Co-Authored-By: <Codex harness 注入的模型署名>
<Codex harness 注入的其他 trailer>: <逐字複製當次內容>
```

### 拆分

- 依可獨立審查與回退的邏輯單位拆分 commit；平台實作、token、CI／發佈流程與文件等不同責任通常分開。
- Token 來源與產生結果視為同一項變更，`tokens/tokens.json` 或 `tokens/platform-map.json` 的修改必須和對應的 `*.generated.*` 一起提交，不要把產生檔單獨拆出。
- 同一功能若同時涵蓋多個平台，可依平台拆分；若必須一起維持跨平台契約，則保留在同一組相關 commit 中，不為了湊平台數量硬拆。
- 提交前先 `git status --short` 確認暫存區只包含本次變更的檔案，尤其不要把使用者仍在編輯中的檔案一併帶入。
