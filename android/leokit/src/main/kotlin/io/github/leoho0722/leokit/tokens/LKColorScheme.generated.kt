package io.github.leoho0722.leokit.tokens

// LeoKit — 由 tokens/generate.mjs 產生，請勿手動編輯。
// 來源：tokens/tokens.json；要改 token 請改那裡，然後執行 `node tokens/generate.mjs`。

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color

/** LeoKit 的語意色彩。以 LKTheme 提供，透過 LKTheme.colors 取用。 */
@Immutable
public data class LKColorScheme(
    /** 頁面最底層背景。iOS: systemGroupedBackground / Android: surfaceContainerLowest / Web: body。卡片與 sheet 疊在它之上。 */
    public val bgCanvas: Color,
    /** 卡片、列表、輸入框、sheet 的主要面。iOS: secondarySystemGroupedBackground / Android: surface。text-primary、text-secondary、text-tertiary 都可讀於此。 */
    public val bgSurface: Color,
    /** 浮在 bg-surface 之上的面：popover、menu、dialog、bottom sheet。淺色靠 shadow-md 區分，深色靠自身較亮的色階區分。 */
    public val bgElevated: Color,
    /** 次要填色：segmented control 軌道、chip、hover 底、skeleton。iOS: tertiarySystemFill / Android: surfaceContainerHigh。text-primary 與 text-secondary 可讀於此。 */
    public val bgSubtle: Color,
    /** 凹陷軌道：progress、slider track、程式碼區塊底。純裝飾填色，不可拿它當控制項的唯一邊界。 */
    public val bgInset: Color,
    /** modal、bottom sheet、drawer 後方的遮罩。iOS: 系統預設 dimming / Android: scrim。 */
    public val bgScrim: Color,
    /** 反轉面：toast／snackbar 的底，讓短暫訊息明顯不屬於頁面內容。只搭配 text-on-inverse 與 brand-on-inverse。Android: inverseSurface。 */
    public val bgInverse: Color,
    /** 主要文字與圖示，讀於 bg-canvas、bg-surface、bg-subtle、bg-inset（兩主題皆 ≥12:1）。iOS: label / Android: onSurface。 */
    public val textPrimary: Color,
    /** 次要說明、副標題、list row 的 subtitle，讀於 bg-canvas、bg-surface、bg-subtle（兩主題皆 ≥6.4:1）。iOS: secondaryLabel / Android: onSurfaceVariant。 */
    public val textSecondary: Color,
    /** placeholder、metadata、footnote，只讀於 bg-canvas 與 bg-surface（≥4.9:1）；不要放在 bg-subtle 上。iOS: tertiaryLabel。 */
    public val textTertiary: Color,
    /** 停用控制項的文字。WCAG 對停用元件免除對比要求，因此停用狀態必須同時降低不透明度並移除互動，不可只靠這個色表達。 */
    public val textDisabled: Color,
    /** brand、brand-hover、brand-pressed 填色上的文字與圖示（≥5.2:1）。深色主題的 brand 變亮，所以這裡是深墨色而不是白色 — 永遠用這個 token，不要寫死 white。 */
    public val textOnBrand: Color,
    /** danger 填色上的文字與圖示（≥5.7:1），用於破壞性主按鈕。 */
    public val textOnDanger: Color,
    /** bg-inverse 上的文字與圖示（兩主題皆 ≥14:1）。狀態色在反轉面上沒有足夠對比，所以 toast 的狀態要靠文字表達，不要用 success／danger 當前景。 */
    public val textOnInverse: Color,
    /** 唯一的品牌色：主按鈕填色、選取態、focus ring、連結。讀於 bg-surface 與 bg-canvas（≥5.4:1），也可當 ≥3:1 的圖示與邊框。iOS: accentColor / Android: primary。 */
    public val brand: Color,
    /** brand 填色的 hover／focus 態（Web 與 Android 有指標時）。iOS 不用 hover，改用 brand-pressed。 */
    public val brandHover: Color,
    /** brand 填色的按下態。三平台都必須有按下回饋：iOS 用這個色或 0.72 不透明度，Android 疊 state layer。 */
    public val brandPressed: Color,
    /** 淡色品牌底：tonal button、選取中的 list row、資訊提示底。只搭配 brand-ink 當前景。iOS: accentColor 的 quaternary fill / Android: secondaryContainer。 */
    public val brandSubtle: Color,
    /** brand-subtle 上的文字與圖示（≥8:1），也可當 bg-surface 上的強調文字。 */
    public val brandInk: Color,
    /** bg-inverse 上的動作文字，例如 toast 的「復原」（兩主題皆 ≥4.9:1）。brand 本身在反轉面上對比不足，一律改用這個。 */
    public val brandOnInverse: Color,
    /** 成功／完成的圖示與 ≥3:1 標記，讀於 bg-surface。不可單獨用色表示狀態，必須同時附文字或圖示。 */
    public val success: Color,
    /** 成功 badge 與提示的底色，前景固定用 success-ink。 */
    public val successSubtle: Color,
    /** success-subtle 與 bg-surface 上的成功文字（≥6.7:1）。 */
    public val successInk: Color,
    /** 警示的圖示與標記，讀於 bg-surface。琥珀色在淺色主題必須壓到這個深度才有 4.5:1，不要改亮。 */
    public val warning: Color,
    /** 警示 badge 與提示的底色，前景固定用 warning-ink。 */
    public val warningSubtle: Color,
    /** warning-subtle 與 bg-surface 上的警示文字（≥7.2:1）。 */
    public val warningInk: Color,
    /** 錯誤與破壞性動作：填色按鈕、錯誤邊框、錯誤圖示。搭配 text-on-danger。iOS: systemRed 的語意位置 / Android: error。 */
    public val danger: Color,
    /** 錯誤 badge 與表單錯誤區塊的底色，前景固定用 danger-ink。 */
    public val dangerSubtle: Color,
    /** danger-subtle 與 bg-surface 上的錯誤文字（≥6.6:1），例如 TextField 的錯誤說明。 */
    public val dangerInk: Color,
    /** 行內連結文字，別名指向 brand，兩主題都跟著 brand 走。Web 連結一律加底線，不可只靠顏色區分。 */
    public val textLink: Color,
    /** 純裝飾分隔線：list row 之間、卡片內的分段。不承載意義，因此不需 3:1。iOS: separator / Android: outlineVariant。 */
    public val borderSubtle: Color,
    /** 卡片與容器的外框，且該容器另有填色或陰影可辨識時使用。若外框是唯一的辨識依據，改用 border-control。 */
    public val borderDefault: Color,
    /** 需要被看見的裝飾性邊界：次要按鈕外框、表格外緣。 */
    public val borderStrong: Color,
    /** 輸入框、checkbox、radio、switch 軌道等「靠邊框才能辨識」的控制項邊界，對 bg-surface、bg-canvas、bg-subtle 皆 ≥3:1，符合 WCAG 1.4.11。 */
    public val borderControl: Color,
    /** 鍵盤 focus ring，2px 實線加 2px offset，對所有它會落在的面皆 ≥3:1。Web 用 outline，Android 用 focus indicator，iOS 由系統 focus engine 處理。 */
    public val borderFocus: Color
)

/**
 * 建出淺色主題要用的那一整組語意色彩。
 *
 * @return 每個 token 都填好淺色值的 [LKColorScheme]
 */
public fun lkLightColorScheme(): LKColorScheme = LKColorScheme(
    bgCanvas = Color(0xFFF5F6F8),
    bgSurface = Color(0xFFFFFFFF),
    bgElevated = Color(0xFFFFFFFF),
    bgSubtle = Color(0xFFECEEF2),
    bgInset = Color(0xFFE3E6EB),
    bgScrim = Color(0x66000000),
    bgInverse = Color(0xFF22262C),
    textPrimary = Color(0xFF14171A),
    textSecondary = Color(0xFF4E555E),
    textTertiary = Color(0xFF646C76),
    textDisabled = Color(0xFFA0A6AE),
    textOnBrand = Color(0xFFFFFFFF),
    textOnDanger = Color(0xFFFFFFFF),
    textOnInverse = Color(0xFFF4F6F8),
    brand = Color(0xFF1E5FCC),
    brandHover = Color(0xFF1A54B5),
    brandPressed = Color(0xFF16489C),
    brandSubtle = Color(0xFFE8EFFC),
    brandInk = Color(0xFF134391),
    brandOnInverse = Color(0xFF8FB8FF),
    success = Color(0xFF1C7C4A),
    successSubtle = Color(0xFFE3F3E9),
    successInk = Color(0xFF145F39),
    warning = Color(0xFF8A5A00),
    warningSubtle = Color(0xFFFBF0DA),
    warningInk = Color(0xFF6D4700),
    danger = Color(0xFFC22B2B),
    dangerSubtle = Color(0xFFFCE9E9),
    dangerInk = Color(0xFF9F1F1F),
    textLink = Color(0xFF1E5FCC),
    borderSubtle = Color(0xFFE4E7EC),
    borderDefault = Color(0xFFD3D8DF),
    borderStrong = Color(0xFFAEB5BF),
    borderControl = Color(0xFF7E858F),
    borderFocus = Color(0xFF1E5FCC)
)

/**
 * 建出深色主題要用的那一整組語意色彩。
 *
 * @return 每個 token 都填好深色值的 [LKColorScheme]
 */
public fun lkDarkColorScheme(): LKColorScheme = LKColorScheme(
    bgCanvas = Color(0xFF0E1116),
    bgSurface = Color(0xFF161A20),
    bgElevated = Color(0xFF1D222A),
    bgSubtle = Color(0xFF232935),
    bgInset = Color(0xFF0A0D11),
    bgScrim = Color(0x99000000),
    bgInverse = Color(0xFFE9ECF1),
    textPrimary = Color(0xFFEBEEF2),
    textSecondary = Color(0xFFA6AEB9),
    textTertiary = Color(0xFF8A929E),
    textDisabled = Color(0xFF5C636D),
    textOnBrand = Color(0xFF08172E),
    textOnDanger = Color(0xFF2A0C0C),
    textOnInverse = Color(0xFF14171A),
    brand = Color(0xFF5B9BFF),
    brandHover = Color(0xFF7AAEFF),
    brandPressed = Color(0xFF4A8AEE),
    brandSubtle = Color(0xFF16243B),
    brandInk = Color(0xFFA8C8FF),
    brandOnInverse = Color(0xFF1E5FCC),
    success = Color(0xFF3FBF78),
    successSubtle = Color(0xFF112619),
    successInk = Color(0xFF74D69D),
    warning = Color(0xFFE0A63C),
    warningSubtle = Color(0xFF2A2112),
    warningInk = Color(0xFFF0C374),
    danger = Color(0xFFFF6B6B),
    dangerSubtle = Color(0xFF2E1618),
    dangerInk = Color(0xFFFF9F9F),
    textLink = Color(0xFF5B9BFF),
    borderSubtle = Color(0xFF262C36),
    borderDefault = Color(0xFF333A45),
    borderStrong = Color(0xFF4A525E),
    borderControl = Color(0xFF737C88),
    borderFocus = Color(0xFF5B9BFF)
)
