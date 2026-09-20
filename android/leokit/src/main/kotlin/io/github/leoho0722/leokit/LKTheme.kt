package io.github.leoho0722.leokit

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Shape
import io.github.leoho0722.leokit.tokens.LKColorScheme
import io.github.leoho0722.leokit.tokens.LKRadius
import io.github.leoho0722.leokit.tokens.LKTypography
import io.github.leoho0722.leokit.tokens.lkDarkColorScheme
import io.github.leoho0722.leokit.tokens.lkLightColorScheme

/**
 * 各級圓角，直接當成背景或外框的形狀使用。
 *
 * 數值與 iOS 相同，但 iOS 用的是轉角更柔和的連續曲線圓角。
 * 只要半徑數字不要形狀時改讀 [LKRadius]。
 */
public object LKShapes {
    /** 不做圓角：滿版圖片、貼齊邊緣的分隔區塊。 */
    public val none: Shape = RoundedCornerShape(LKRadius.radiusNone)

    /** checkbox、小標記、內嵌的程式碼片段。 */
    public val xs: Shape = RoundedCornerShape(LKRadius.radiusXs)

    /** 小尺寸按鈕、分段控制項裡的選取指示。 */
    public val sm: Shape = RoundedCornerShape(LKRadius.radiusSm)

    /** 預設圓角：按鈕、輸入框、小卡片。 */
    public val md: Shape = RoundedCornerShape(LKRadius.radiusMd)

    /** 卡片、群組列表容器、彈出選單。 */
    public val lg: Shape = RoundedCornerShape(LKRadius.radiusLg)

    /** 由下往上推出的面板與對話框的上緣、大型特色卡片。 */
    public val xl: Shape = RoundedCornerShape(LKRadius.radiusXl)

    /** 全螢幕面板的上緣，行動裝置上最大的圓角。 */
    public val xxl: Shape = RoundedCornerShape(LKRadius.radius2xl)

    /** 膠囊按鈕、filter chip、狀態標記、頭像。FAB 請用 [lg] 而不是這個。 */
    public val pill: Shape = RoundedCornerShape(percent = 50)
}

/** 目前這一層 composition 生效的語意色彩，由 [LKTheme] 放進來。 */
internal val LocalLKColors = staticCompositionLocalOf { lkLightColorScheme() }

/** 目前這一層 composition 生效的字級，由 [LKTheme] 放進來。 */
internal val LocalLKTypography = staticCompositionLocalOf { LKTypography() }

/** 在畫面裡取用 LeoKit 的 token。必須包在 [LKTheme] 內才讀得到正確的值。 */
public object LKTheme {
    /** 目前主題的語意色彩，會跟著淺色或深色自動換。 */
    public val colors: LKColorScheme
        @Composable @ReadOnlyComposable get() = LocalLKColors.current

    /** 目前主題的字級。 */
    public val typography: LKTypography
        @Composable @ReadOnlyComposable get() = LocalLKTypography.current

    /** 各級圓角。不隨主題變化，所以在 composition 之外也讀得到。 */
    public val shapes: LKShapes get() = LKShapes
}

/**
 * LeoKit 的主題容器。把它包在畫面最外層，裡面的元件才拿得到 token。
 *
 * 深色與否預設跟隨系統 —— 不要自己做主題切換器取代系統設定，
 * 只在設定頁提供「跟隨系統／淺色／深色」三選一，再把結果傳進 [darkTheme]。
 *
 * @param darkTheme 是否套用深色主題；預設跟隨系統設定
 * @param content 套用這個主題的畫面內容
 */
@Composable
public fun LKTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colors = if (darkTheme) lkDarkColorScheme() else lkLightColorScheme()
    CompositionLocalProvider(
        LocalLKColors provides colors,
        LocalLKTypography provides LKTypography(),
        LocalContentColor provides colors.textPrimary,
    ) {
        MaterialTheme(content = content)
    }
}
