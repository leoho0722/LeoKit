//
//  LKColorValues.generated.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

// LeoKit — 由 tokens/generate.mjs 產生，請勿手動編輯。
// 來源：tokens/tokens.json；要改 token 請改那裡，然後執行 `node tokens/generate.mjs`。

/// 每個色彩 token 在淺色與深色主題下的實際色值
///
/// - Note: 測試與工具可以直接讀它，不必經過平台的動態色機制
/// - Note: 畫面上要用的顏色請改用 `LKColor`
public enum LKColorValues {

    // MARK: - Properties

    /// 頁面最底層背景
    ///
    /// - Note: iOS: systemGroupedBackground / Android: surfaceContainerLowest / Web: body
    /// - Note: 卡片與 sheet 疊在它之上
    public static let bgCanvas = LKColorValue(light: 0xF5F6F8, dark: 0x0E1116)

    /// 卡片、列表、輸入框、sheet 的主要面
    ///
    /// - Note: iOS: secondarySystemGroupedBackground / Android: surface
    /// - Note: text-primary、text-secondary、text-tertiary 都可讀於此
    public static let bgSurface = LKColorValue(light: 0xFFFFFF, dark: 0x161A20)

    /// 浮在 bg-surface 之上的面：popover、menu、dialog、bottom sheet
    ///
    /// - Note: 淺色靠 shadow-md 區分，深色靠自身較亮的色階區分
    public static let bgElevated = LKColorValue(light: 0xFFFFFF, dark: 0x1D222A)

    /// 次要填色：segmented control 軌道、chip、hover 底、skeleton
    ///
    /// - Note: iOS: tertiarySystemFill / Android: surfaceContainerHigh
    /// - Note: text-primary 與 text-secondary 可讀於此
    public static let bgSubtle = LKColorValue(light: 0xECEEF2, dark: 0x232935)

    /// 凹陷軌道：progress、slider track、程式碼區塊底
    ///
    /// - Note: 純裝飾填色，不可拿它當控制項的唯一邊界
    public static let bgInset = LKColorValue(light: 0xE3E6EB, dark: 0x0A0D11)

    /// modal、bottom sheet、drawer 後方的遮罩
    ///
    /// - Note: iOS: 系統預設 dimming / Android: scrim
    public static let bgScrim = LKColorValue(
        light: 0x000000,
        lightAlpha: 0.4,
        dark: 0x000000,
        darkAlpha: 0.6
    )

    /// 反轉面：toast／snackbar 的底，讓短暫訊息明顯不屬於頁面內容
    ///
    /// - Note: 只搭配 text-on-inverse 與 brand-on-inverse
    /// - Note: Android: inverseSurface
    public static let bgInverse = LKColorValue(light: 0x22262C, dark: 0xE9ECF1)

    /// 主要文字與圖示，讀於 bg-canvas、bg-surface、bg-subtle、bg-inset（兩主題皆 ≥12:1）
    ///
    /// - Note: iOS: label / Android: onSurface
    public static let textPrimary = LKColorValue(light: 0x14171A, dark: 0xEBEEF2)

    /// 次要說明、副標題、list row 的 subtitle，讀於 bg-canvas、bg-surface、bg-subtle（兩主題皆 ≥6.4:1）
    ///
    /// - Note: iOS: secondaryLabel / Android: onSurfaceVariant
    public static let textSecondary = LKColorValue(light: 0x4E555E, dark: 0xA6AEB9)

    /// placeholder、metadata、footnote，只讀於 bg-canvas 與 bg-surface（≥4.9:1）；不要放在 bg-subtle 上
    ///
    /// - Note: iOS: tertiaryLabel
    public static let textTertiary = LKColorValue(light: 0x646C76, dark: 0x8A929E)

    /// 停用控制項的文字
    ///
    /// - Note: WCAG 對停用元件免除對比要求，因此停用狀態必須同時降低不透明度並移除互動，不可只靠這個色表達
    public static let textDisabled = LKColorValue(light: 0xA0A6AE, dark: 0x5C636D)

    /// brand、brand-hover、brand-pressed 填色上的文字與圖示（≥5.2:1）
    ///
    /// - Note: 深色主題的 brand 變亮，所以這裡是深墨色而不是白色 — 永遠用這個 token，不要寫死 white
    public static let textOnBrand = LKColorValue(light: 0xFFFFFF, dark: 0x08172E)

    /// danger 填色上的文字與圖示（≥5.7:1），用於破壞性主按鈕
    public static let textOnDanger = LKColorValue(light: 0xFFFFFF, dark: 0x2A0C0C)

    /// bg-inverse 上的文字與圖示（兩主題皆 ≥14:1）
    ///
    /// - Note: 狀態色在反轉面上沒有足夠對比，所以 toast 的狀態要靠文字表達，不要用 success／danger 當前景
    public static let textOnInverse = LKColorValue(light: 0xF4F6F8, dark: 0x14171A)

    /// 唯一的品牌色：主按鈕填色、選取態、focus ring、連結
    ///
    /// - Note: 讀於 bg-surface 與 bg-canvas（≥5.4:1），也可當 ≥3:1 的圖示與邊框
    /// - Note: iOS: accentColor / Android: primary
    public static let brand = LKColorValue(light: 0x1E5FCC, dark: 0x5B9BFF)

    /// brand 填色的 hover／focus 態（Web 與 Android 有指標時）
    ///
    /// - Note: iOS 不用 hover，改用 brand-pressed
    public static let brandHover = LKColorValue(light: 0x1A54B5, dark: 0x7AAEFF)

    /// brand 填色的按下態
    ///
    /// - Note: 三平台都必須有按下回饋：iOS 用這個色或 0.72 不透明度，Android 疊 state layer
    public static let brandPressed = LKColorValue(light: 0x16489C, dark: 0x4A8AEE)

    /// 淡色品牌底：tonal button、選取中的 list row、資訊提示底
    ///
    /// - Note: 只搭配 brand-ink 當前景
    /// - Note: iOS: accentColor 的 quaternary fill / Android: secondaryContainer
    public static let brandSubtle = LKColorValue(light: 0xE8EFFC, dark: 0x16243B)

    /// brand-subtle 上的文字與圖示（≥8:1），也可當 bg-surface 上的強調文字
    public static let brandInk = LKColorValue(light: 0x134391, dark: 0xA8C8FF)

    /// bg-inverse 上的動作文字，例如 toast 的「復原」（兩主題皆 ≥4.9:1）
    ///
    /// - Note: brand 本身在反轉面上對比不足，一律改用這個
    public static let brandOnInverse = LKColorValue(light: 0x8FB8FF, dark: 0x1E5FCC)

    /// 成功／完成的圖示與 ≥3:1 標記，讀於 bg-surface
    ///
    /// - Note: 不可單獨用色表示狀態，必須同時附文字或圖示
    public static let success = LKColorValue(light: 0x1C7C4A, dark: 0x3FBF78)

    /// 成功 badge 與提示的底色，前景固定用 success-ink
    public static let successSubtle = LKColorValue(light: 0xE3F3E9, dark: 0x112619)

    /// success-subtle 與 bg-surface 上的成功文字（≥6.7:1）
    public static let successInk = LKColorValue(light: 0x145F39, dark: 0x74D69D)

    /// 警示的圖示與標記，讀於 bg-surface
    ///
    /// - Note: 琥珀色在淺色主題必須壓到這個深度才有 4.5:1，不要改亮
    public static let warning = LKColorValue(light: 0x8A5A00, dark: 0xE0A63C)

    /// 警示 badge 與提示的底色，前景固定用 warning-ink
    public static let warningSubtle = LKColorValue(light: 0xFBF0DA, dark: 0x2A2112)

    /// warning-subtle 與 bg-surface 上的警示文字（≥7.2:1）
    public static let warningInk = LKColorValue(light: 0x6D4700, dark: 0xF0C374)

    /// 錯誤與破壞性動作：填色按鈕、錯誤邊框、錯誤圖示
    ///
    /// - Note: 搭配 text-on-danger
    /// - Note: iOS: systemRed 的語意位置 / Android: error
    public static let danger = LKColorValue(light: 0xC22B2B, dark: 0xFF6B6B)

    /// 錯誤 badge 與表單錯誤區塊的底色，前景固定用 danger-ink
    public static let dangerSubtle = LKColorValue(light: 0xFCE9E9, dark: 0x2E1618)

    /// danger-subtle 與 bg-surface 上的錯誤文字（≥6.6:1），例如 TextField 的錯誤說明
    public static let dangerInk = LKColorValue(light: 0x9F1F1F, dark: 0xFF9F9F)

    /// 行內連結文字，別名指向 brand，兩主題都跟著 brand 走
    ///
    /// - Note: Web 連結一律加底線，不可只靠顏色區分
    public static let textLink = LKColorValue(light: 0x1E5FCC, dark: 0x5B9BFF)

    /// 純裝飾分隔線：list row 之間、卡片內的分段
    ///
    /// - Note: 不承載意義，因此不需 3:1
    /// - Note: iOS: separator / Android: outlineVariant
    public static let borderSubtle = LKColorValue(light: 0xE4E7EC, dark: 0x262C36)

    /// 卡片與容器的外框，且該容器另有填色或陰影可辨識時使用
    ///
    /// - Note: 若外框是唯一的辨識依據，改用 border-control
    public static let borderDefault = LKColorValue(light: 0xD3D8DF, dark: 0x333A45)

    /// 需要被看見的裝飾性邊界：次要按鈕外框、表格外緣
    public static let borderStrong = LKColorValue(light: 0xAEB5BF, dark: 0x4A525E)

    /// 輸入框、checkbox、radio、switch 軌道等「靠邊框才能辨識」的控制項邊界，對 bg-surface、bg-canvas、bg-subtle 皆 ≥3:1，符合 WCAG
    /// 1.4.11
    public static let borderControl = LKColorValue(light: 0x7E858F, dark: 0x737C88)

    /// 鍵盤 focus ring，2px 實線加 2px offset，對所有它會落在的面皆 ≥3:1
    ///
    /// - Note: Web 用 outline，Android 用 focus indicator，iOS 由系統 focus engine 處理
    public static let borderFocus = LKColorValue(light: 0x1E5FCC, dark: 0x5B9BFF)

    /// 全部色彩 token，key 是 tokens.json 裡的原始名稱
    ///
    /// - Note: 供測試列舉與工具比對使用
    public static let all: [String: LKColorValue] = [
        "bg-canvas": bgCanvas,
        "bg-surface": bgSurface,
        "bg-elevated": bgElevated,
        "bg-subtle": bgSubtle,
        "bg-inset": bgInset,
        "bg-scrim": bgScrim,
        "bg-inverse": bgInverse,
        "text-primary": textPrimary,
        "text-secondary": textSecondary,
        "text-tertiary": textTertiary,
        "text-disabled": textDisabled,
        "text-on-brand": textOnBrand,
        "text-on-danger": textOnDanger,
        "text-on-inverse": textOnInverse,
        "brand": brand,
        "brand-hover": brandHover,
        "brand-pressed": brandPressed,
        "brand-subtle": brandSubtle,
        "brand-ink": brandInk,
        "brand-on-inverse": brandOnInverse,
        "success": success,
        "success-subtle": successSubtle,
        "success-ink": successInk,
        "warning": warning,
        "warning-subtle": warningSubtle,
        "warning-ink": warningInk,
        "danger": danger,
        "danger-subtle": dangerSubtle,
        "danger-ink": dangerInk,
        "text-link": textLink,
        "border-subtle": borderSubtle,
        "border-default": borderDefault,
        "border-strong": borderStrong,
        "border-control": borderControl,
        "border-focus": borderFocus,
    ]
}
