package io.github.leoho0722.leokit

import androidx.compose.ui.graphics.Color
import io.github.leoho0722.leokit.tokens.LKOpacity
import io.github.leoho0722.leokit.tokens.LKRadius
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing
import io.github.leoho0722.leokit.tokens.LKTypography
import io.github.leoho0722.leokit.tokens.lkDarkColorScheme
import io.github.leoho0722.leokit.tokens.lkLightColorScheme
import kotlin.math.pow
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Token 層的測試。
 *
 * 這些值是從 tokens/tokens.json 產生的，所以測試的意義是「產生器沒有把值弄壞」，
 * 以及「設計系統承諾的對比度在 Kotlin 這邊依然成立」。
 */
public class LKTokensTest {

    private val light = lkLightColorScheme()
    private val dark = lkDarkColorScheme()

    @Test
    public fun `品牌色與來源一致`() {
        assertEquals(Color(0xFF1E5FCC), light.brand)
        assertEquals(Color(0xFF5B9BFF), dark.brand)
        assertEquals(Color(0xFFF5F6F8), light.bgCanvas)
        assertEquals(Color(0xFF0E1116), dark.bgCanvas)
    }

    @Test
    public fun `別名在兩個主題都指向 brand`() {
        assertEquals(light.brand, light.textLink)
        assertEquals(dark.brand, dark.textLink)
        assertEquals(light.brand, light.borderFocus)
        assertEquals(dark.brand, dark.borderFocus)
    }

    @Test
    public fun `遮罩保留 alpha`() {
        assertEquals(0.4f, light.bgScrim.alpha, 0.01f)
        assertEquals(0.6f, dark.bgScrim.alpha, 0.01f)
    }

    @Test
    public fun `space-N 等於 N 乘以 4dp`() {
        assertEquals(0f, LKSpacing.spacing0.value, 0f)
        assertEquals(2f, LKSpacing.spacing2.value, 0f)
        assertEquals(4f, LKSpacing.spacing4.value, 0f)
        assertEquals(16f, LKSpacing.spacing16.value, 0f)
        assertEquals(24f, LKSpacing.spacing24.value, 0f)
        assertEquals(64f, LKSpacing.spacing64.value, 0f)
    }

    @Test
    public fun `控制項高度滿足兩個平台的最小觸控`() {
        assertEquals("預設控制項高度要滿足 iOS 的 44pt", 44f, LKSize.controlHMd.value, 0f)
        assertEquals(44f, LKSize.tapMinIos.value, 0f)
        assertEquals("Android 的最小觸控是 48dp", 48f, LKSize.tapMinAndroid.value, 0f)
        assertTrue(LKSize.controlHLg.value > LKSize.controlHMd.value)
    }

    @Test
    public fun `圓角尺度是遞增的`() {
        val scale = listOf(
            LKRadius.radiusNone, LKRadius.radiusXs, LKRadius.radiusSm,
            LKRadius.radiusMd, LKRadius.radiusLg, LKRadius.radiusXl, LKRadius.radius2xl,
        ).map { it.value }
        assertEquals("圓角尺度必須由小到大", scale.sorted(), scale)
    }

    @Test
    public fun `停用態不透明度在合理範圍`() {
        assertTrue(LKOpacity.opacityDisabled in 0.3f..0.5f)
        assertTrue(LKOpacity.opacityPressed in 0.6f..0.9f)
    }

    @Test
    public fun `字級有完整的 fontSize 與 lineHeight`() {
        val t = LKTypography()
        val styles = listOf(t.display, t.title1, t.title2, t.title3, t.headline, t.body, t.callout, t.footnote, t.caption)
        styles.forEach {
            assertTrue("fontSize 必須有值", it.fontSize.value > 0f)
            assertTrue("lineHeight 不該小於 fontSize", it.lineHeight.value >= it.fontSize.value)
        }
        assertEquals(16f, t.body.fontSize.value, 0f)
        assertEquals(24f, t.body.lineHeight.value, 0f)
    }

    @Test
    public fun `文字對底色在兩個主題都達到 WCAG AA`() {
        val checks = listOf(light to "light", dark to "dark").flatMap { (c, theme) ->
            listOf(
                ContrastCheck("$theme textPrimary/bgSurface", c.textPrimary, c.bgSurface, 4.5),
                ContrastCheck("$theme textSecondary/bgSurface", c.textSecondary, c.bgSurface, 4.5),
                ContrastCheck("$theme textTertiary/bgSurface", c.textTertiary, c.bgSurface, 4.5),
                ContrastCheck("$theme textOnBrand/brand", c.textOnBrand, c.brand, 4.5),
                ContrastCheck("$theme brandInk/brandSubtle", c.brandInk, c.brandSubtle, 4.5),
                ContrastCheck("$theme dangerInk/dangerSubtle", c.dangerInk, c.dangerSubtle, 4.5),
                ContrastCheck("$theme textOnInverse/bgInverse", c.textOnInverse, c.bgInverse, 4.5),
                // 靠邊框才能辨識的控制項：WCAG 1.4.11
                ContrastCheck("$theme borderControl/bgSurface", c.borderControl, c.bgSurface, 3.0),
            )
        }
        checks.forEach { (name, fg, bg, min) ->
            val ratio = contrastRatio(fg, bg)
            assertTrue("$name 只有 ${"%.2f".format(ratio)}:1，需 ≥ $min", ratio >= min)
        }
    }

    private fun relativeLuminance(color: Color): Double {
        fun channel(v: Float): Double {
            val c = v.toDouble()
            return if (c <= 0.03928) c / 12.92 else ((c + 0.055) / 1.055).pow(2.4)
        }
        return 0.2126 * channel(color.red) + 0.7152 * channel(color.green) + 0.0722 * channel(color.blue)
    }

    private fun contrastRatio(a: Color, b: Color): Double {
        val la = relativeLuminance(a)
        val lb = relativeLuminance(b)
        val hi = maxOf(la, lb)
        val lo = minOf(la, lb)
        return (hi + 0.05) / (lo + 0.05)
    }
}

private data class ContrastCheck(
    val name: String,
    val fg: Color,
    val bg: Color,
    val min: Double,
)
