package io.github.leoho0722.leokit.tokens

// LeoKit — 由 tokens/generate.mjs 產生，請勿手動編輯。
// 來源：tokens/tokens.json；要改 token 請改那裡，然後執行 `node tokens/generate.mjs`。

import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/** 元件之間與元件內部的間距刻度，名稱就是實際的 dp 數。除了半階的 2，每一階都是 4 的倍數，不要自己插入中間值。 */
public object LKSpacing {
    /** 顯式歸零，用來覆蓋繼承的間距。 */
    public val spacing0: Dp = 0.dp
    /** 圖示與其標籤之間、badge 內的垂直微調。 */
    public val spacing2: Dp = 2.dp
    /** 最小間距：標題與副標題之間、緊鄰的圖示群。 */
    public val spacing4: Dp = 4.dp
    /** 按鈕內圖示與文字的間距、chip 之間、小尺寸按鈕的水平 padding 基礎。 */
    public val spacing8: Dp = 8.dp
    /** 輸入框水平 padding、list row 垂直 padding、卡片內元素間距。 */
    public val spacing12: Dp = 12.dp
    /** 預設版面邊距與卡片 padding。iOS list 的標準 leading inset 也是 16。 */
    public val spacing16: Dp = 16.dp
    /** 較寬鬆的卡片 padding、sheet 內距。 */
    public val spacing20: Dp = 20.dp
    /** 區塊之間的間距、sheet 的上下內距。 */
    public val spacing24: Dp = 24.dp
    /** 主要區段之間的分隔。 */
    public val spacing32: Dp = 32.dp
    /** 頁面標題與第一個區塊之間。 */
    public val spacing40: Dp = 40.dp
    /** 大區段分隔、空狀態的上下留白。 */
    public val spacing48: Dp = 48.dp
    /** 頁面級留白，僅用於 Web 寬版面與空狀態。 */
    public val spacing64: Dp = 64.dp
}

/** 圓角半徑的刻度，單位為 dp。以 RoundedCornerShape 套用。 */
public object LKRadius {
    /** 滿版元素：全寬圖片、貼齊邊緣的分隔區塊。 */
    public val radiusNone: Dp = 0.dp
    /** checkbox、小 badge、內嵌 code。 */
    public val radiusXs: Dp = 4.dp
    /** 小尺寸按鈕（control-h-sm）、segmented control 內的選取指示、toast 內的動作。filter chip 用 radius-pill。 */
    public val radiusSm: Dp = 6.dp
    /** 預設半徑：按鈕、輸入框、小卡片。 */
    public val radiusMd: Dp = 10.dp
    /** 卡片、群組化列表容器、彈出選單。 */
    public val radiusLg: Dp = 14.dp
    /** bottom sheet 與 dialog 的上緣、大型特色卡片。 */
    public val radiusXl: Dp = 20.dp
    /** 全螢幕 sheet 上緣、行動端最大圓角。 */
    public val radius2xl: Dp = 28.dp
    /** 膠囊按鈕、filter chip、狀態 badge、avatar。Android FAB 請用 radius-lg 而非 pill。 */
    public val radiusPill: Dp = 999.dp
}

/** 控制項高度、圖示、頭像與邊框寬度的固定尺寸，單位為 dp。 */
public object LKSize {
    /** 密集介面中的次要按鈕與 chip。低於 44 時必須靠外距把可點擊範圍補到平台最小值。 */
    public val controlHSm: Dp = 32.dp
    /** 預設按鈕與輸入框高度，同時滿足 iOS 的 44pt 最小觸控。 */
    public val controlHMd: Dp = 44.dp
    /** 主要行動按鈕、全寬 CTA、表單送出。 */
    public val controlHLg: Dp = 52.dp
    /** iOS 最小可點擊邊長（HIG）。圖示按鈕即使視覺只有 20px，命中區也要撐到這個值。 */
    public val tapMinIos: Dp = 44.dp
    /** Android 最小可點擊邊長（Material accessibility）。Android 版的圖示按鈕用這個值。 */
    public val tapMinAndroid: Dp = 48.dp
    /** 行內圖示、badge 內圖示、按鈕內的小圖示。 */
    public val iconSm: Dp = 16.dp
    /** 預設圖示尺寸：按鈕、list row leading、app bar action。 */
    public val iconMd: Dp = 20.dp
    /** tab bar 圖示、較大的 list row leading。 */
    public val iconLg: Dp = 24.dp
    /** 空狀態與功能入口的圖示。 */
    public val iconXl: Dp = 28.dp
    /** checkbox 與 radio 的方框邊長。方框本身小於觸控最小值，命中區靠整列（標籤一起）撐到 control-h-md。 */
    public val choiceSize: Dp = 20.dp
    /** 列表內的小頭像、疊加頭像群。 */
    public val avatarSm: Dp = 28.dp
    /** 預設頭像尺寸：list row leading、選單中的使用者。 */
    public val avatarMd: Dp = 36.dp
    /** 個人資料頁與卡片標頭的頭像。 */
    public val avatarLg: Dp = 48.dp
    /** 進度條與 slider 的軌道高度。填色與軌道之間需 ≥3:1，所以軌道固定用 bg-inset、填色用 brand 或 success。 */
    public val trackH: Dp = 6.dp
    /** slider 拖曳把手直徑。iOS 的原生把手 28pt、Android 20dp，行動端交給平台元件即可。 */
    public val sliderThumb: Dp = 24.dp
    /** 底部主導覽的高度（不含安全區）。iOS tab bar 為 49pt 加安全區，Android navigation bar 為 80dp — 行動端以平台值為準。 */
    public val tabbarH: Dp = 56.dp
    /** 分隔線與邊框寬度。iOS 上請用 1 physical pixel 的 divider，不要用 1pt。 */
    public val hairline: Dp = 1.dp
    /** 需要更明確的邊界：錯誤態輸入框、選取中的卡片。 */
    public val borderWStrong: Dp = 1.5.dp
    /** focus ring 線寬，搭配 border-focus。 */
    public val focusRingW: Dp = 2.dp
    /** focus ring 與元件邊緣的距離，讓 ring 不與邊框混在一起。 */
    public val focusRingOffset: Dp = 2.dp
    /** Web 長文與表單的最大寬度，維持每行 60–75 字元。 */
    public val contentMax: Dp = 720.dp
    /** Web 應用版面的最大寬度。 */
    public val layoutMax: Dp = 1120.dp
}

/** 停用、按下、滑過與選取這些狀態要疊上的不透明度。 */
public object LKOpacity {
    /** 停用態整體不透明度，必須同時移除互動與 aria-disabled。 */
    public const val opacityDisabled: Float = 0.40f
    /** iOS 風格按下回饋（沒有專用 pressed 色時使用）。 */
    public const val opacityPressed: Float = 0.72f
    /** Web 與 Android 指標 hover 時疊在元件上的 text-primary 層。 */
    public const val opacityHoverLayer: Float = 0.06f
    /** 選取態疊層的 brand 不透明度：selected list row、selected chip。 */
    public const val opacitySelectedLayer: Float = 0.12f
}
