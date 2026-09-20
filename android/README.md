# LeoKit — Android

minSdk 31、compileSdk 37.2、Compose + Material 3。

## 用法

```kotlin
LKTheme {
    LKListRow(
        title = "Netflix 標準方案",
        subtitle = "每月 3 日扣款",
        value = "NT$ 390",
        showChevron = true,
        onClick = { },
    )

    LKButton(label = "新增訂閱", onClick = { })

    LKBanner(
        message = "付款卡片已過期，下次扣款也會失敗。",
        title = "Netflix 扣款失敗",
        tone = LKBannerTone.Danger,
        icon = LKIcons.Alert,
    ) {
        LKButton(label = "更新付款方式", onClick = { }, variant = LKButtonVariant.Plain, size = LKButtonSize.Small)
    }
}
```

`LKTheme.colors` / `.typography` / `.shapes` 取得 token。深色與否預設跟隨系統。

## 注意

- **AGP 9 內建 Kotlin 支援**，所以不要再套用 `org.jetbrains.kotlin.android`，套了會直接失敗。
- `explicitApi` 的旗標是透過 `freeCompilerArgs` 加的，會一併套用到測試原始碼 ——
  測試裡的宣告也要寫出 `public`。
- 測試用中文的 backtick 函式名稱，locale 必須是 UTF-8（`LANG=C.UTF-8`），
  否則 Kotlin 編譯器寫不出含中文的 class 檔名。

## 編譯

```bash
./gradlew :leokit:assembleRelease :leokit:test
```
