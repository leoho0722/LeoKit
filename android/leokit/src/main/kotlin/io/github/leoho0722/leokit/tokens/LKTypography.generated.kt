package io.github.leoho0722.leokit.tokens

// LeoKit — 由 tokens/generate.mjs 產生，請勿手動編輯。
// 來源：tokens/tokens.json；要改 token 請改那裡，然後執行 `node tokens/generate.mjs`。

import androidx.compose.runtime.Immutable
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/** LeoKit 的字級。註解裡是對應的 Material 3 type role。 */
@Immutable
public data class LKTypography(
    /** 頁面最大標題，一頁一個。iOS: .largeTitle / Android: displaySmall。 Material 3: displaySmall */
    public val display: TextStyle = TextStyle(
        fontSize = 34.sp,
        lineHeight = 40.sp,
        fontWeight = FontWeight.Bold, letterSpacing = -0.4.sp
    ),
    /** 區段主標題與 large title navigation bar。iOS: .title1 / Android: headlineMedium。 Material 3: headlineMedium */
    public val title1: TextStyle = TextStyle(
        fontSize = 28.sp,
        lineHeight = 34.sp,
        fontWeight = FontWeight.Bold, letterSpacing = -0.3.sp
    ),
    /** 卡片群組標題、sheet 標題。iOS: .title2 / Android: headlineSmall。 Material 3: headlineSmall */
    public val title2: TextStyle = TextStyle(
        fontSize = 22.sp,
        lineHeight = 28.sp,
        fontWeight = FontWeight.SemiBold, letterSpacing = -0.2.sp
    ),
    /** 卡片標題與小節標題。iOS: .title3（20pt）/ Android: titleLarge（22sp）— 行動端放大到平台值，Web 用 18px。 Material 3: titleLarge */
    public val title3: TextStyle = TextStyle(
        fontSize = 18.sp,
        lineHeight = 24.sp,
        fontWeight = FontWeight.SemiBold
    ),
    /** list row 的主要文字、強調的單行標題。iOS: .headline / Android: titleMedium。 Material 3: titleMedium */
    public val headline: TextStyle = TextStyle(
        fontSize = 16.sp,
        lineHeight = 22.sp,
        fontWeight = FontWeight.SemiBold
    ),
    /** 預設內文。iOS: .body（17pt）/ Android: bodyLarge（16sp）/ Web: 16px。行動端一律交給 Dynamic Type／字級設定，不要寫死。 Material 3: bodyLarge */
    public val body: TextStyle = TextStyle(
        fontSize = 16.sp,
        lineHeight = 24.sp,
        fontWeight = FontWeight.Normal
    ),
    /** 內文中的強調字與金額。等寬數字請一併開啟 font-variant-numeric: tabular-nums。 Material 3: bodyLarge */
    public val bodyStrong: TextStyle = TextStyle(
        fontSize = 16.sp,
        lineHeight = 24.sp,
        fontWeight = FontWeight.SemiBold
    ),
    /** 密度較高的內文，例如卡片內說明。iOS: .callout / Android: bodyMedium。 Material 3: bodyMedium */
    public val callout: TextStyle = TextStyle(
        fontSize = 15.sp,
        lineHeight = 22.sp,
        fontWeight = FontWeight.Normal
    ),
    /** 列表分組標題、欄位標籤。iOS: .subheadline / Android: titleSmall。 Material 3: titleSmall */
    public val subhead: TextStyle = TextStyle(
        fontSize = 14.sp,
        lineHeight = 20.sp,
        fontWeight = FontWeight.Medium
    ),
    /** 輔助說明、TextField helper text。iOS: .footnote / Android: bodySmall。搭配 text-secondary，不要用 text-tertiary 放在 bg-subtle 上。 Material 3: bodySmall */
    public val footnote: TextStyle = TextStyle(
        fontSize = 13.sp,
        lineHeight = 18.sp,
        fontWeight = FontWeight.Normal
    ),
    /** 最小可用字級，僅限 metadata 與時間戳。iOS: .caption1 / Android: labelSmall。不要用於可讀性重要的內容。 Material 3: labelSmall */
    public val caption: TextStyle = TextStyle(
        fontSize = 12.sp,
        lineHeight = 16.sp,
        fontWeight = FontWeight.Normal
    ),
    /** 大尺寸按鈕文字（control-h-lg）。 Material 3: labelLarge */
    public val labelLg: TextStyle = TextStyle(
        fontSize = 16.sp,
        lineHeight = 20.sp,
        fontWeight = FontWeight.SemiBold
    ),
    /** 預設按鈕、segmented control、tab 文字。iOS: 按鈕的 .body semibold / Android: labelLarge。 Material 3: labelLarge */
    public val label: TextStyle = TextStyle(
        fontSize = 14.sp,
        lineHeight = 16.sp,
        fontWeight = FontWeight.SemiBold
    ),
    /** badge 與小尺寸按鈕文字。全大寫英文時保留這個字距，中文不要加字距。 Material 3: labelSmall */
    public val labelSm: TextStyle = TextStyle(
        fontSize = 12.sp,
        lineHeight = 16.sp,
        fontWeight = FontWeight.SemiBold, letterSpacing = 0.2.sp
    ),
    /** 程式碼、token 名稱、ID 與短碼。搭配 bg-inset 或 bg-subtle 作底。 Material 3: bodySmall */
    public val code: TextStyle = TextStyle(
        fontSize = 13.sp,
        lineHeight = 20.sp,
        fontWeight = FontWeight.Normal, fontFamily = FontFamily.Monospace
    )
)
