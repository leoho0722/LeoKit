//
//  LKTokensTests.swift
//  LeoKitTests
//
//  Created by Leo Ho on 2026/09/19.
//

import Foundation
import Testing

@testable import LeoKit

/// 從 tokens.json 產生出來的那些 token 型別的單元測試
///
/// - Note: 這些值都是產生器寫出來的，所以測的是「產生器沒有把值弄壞」
/// - Note: 另一半是測「設計系統承諾的對比度在 Swift 這邊依然成立」
/// - Note: 一律讀 `LKColorValues` 的原始值，不經過系統的動態換色機制
struct LKTokensTests {

    // MARK: - Tests

    /// 品牌色與頁面底色都和 tokens.json 的來源值一致
    @Test
    func colors_afterGeneration_matchSourceValues() {
        // Given

        // When
        let brand = LKColorValues.brand
        let canvas = LKColorValues.bgCanvas

        // Then
        #expect(brand.light == 0x1E5FCC)
        #expect(brand.dark == 0x5B9BFF)
        #expect(canvas.light == 0xF5F6F8)
        #expect(canvas.dark == 0x0E1116)
    }

    /// 指向 brand 的別名在兩個主題都跟著 brand 走
    @Test
    func aliases_whenPointingAtBrand_equalBrand() {
        // Given
        let brand = LKColorValues.brand

        // When
        let link = LKColorValues.textLink
        let focus = LKColorValues.borderFocus

        // Then
        #expect(link == brand)
        #expect(focus == brand)
    }

    /// 遮罩的半透明在產生後沒有被壓成不透明
    @Test
    func scrim_afterGeneration_keepsAlpha() {
        // Given

        // When
        let scrim = LKColorValues.bgScrim

        // Then
        #expect(scrim.lightAlpha == 0.4)
        #expect(scrim.darkAlpha == 0.6)
    }

    /// 間距刻度的每一階都是 4 的倍數
    @Test
    func spacing_atEveryStep_followsFourPointScale() {
        // Given

        // When
        let scale = [
            LKSpacing.spacing0,
            LKSpacing.spacing2,
            LKSpacing.spacing4,
            LKSpacing.spacing16,
            LKSpacing.spacing24,
            LKSpacing.spacing64,
        ]

        // Then
        #expect(scale == [0, 2, 4, 16, 24, 64])
    }

    /// 預設控制項高度滿足 Apple 要求的最小可點範圍，兩個平台的最小值也各自保留
    @Test
    func controlHeights_forBothPlatforms_meetMinimumTapTargets() {
        // Given
        let iOSMinimum = LKSize.tapMinIos

        // When
        let medium = LKSize.controlHMd
        let large = LKSize.controlHLg

        // Then
        #expect(medium == iOSMinimum, "預設控制項高度要滿足 HIG 的 44pt")
        #expect(large > medium)
        #expect(LKSize.tapMinAndroid == 48)
    }

    /// 圓角刻度由小到大，中間沒有跳掉或顛倒
    @Test
    func radiusScale_fromNoneToLargest_increasesMonotonically() {
        // Given
        let scale = [
            LKRadius.radiusNone,
            LKRadius.radiusXs,
            LKRadius.radiusSm,
            LKRadius.radiusMd,
            LKRadius.radiusLg,
            LKRadius.radiusXl,
            LKRadius.radius2xl,
        ]

        // When
        let sorted = scale.sorted()

        // Then
        #expect(scale == sorted, "圓角尺度必須由小到大")
    }

    /// 停用態與按下態的不透明度都落在看得出來但不至於消失的範圍
    @Test
    func opacities_forDisabledAndPressed_stayInUsableRanges() {
        // Given
        let disabledRange = 0.3...0.5
        let pressedRange = 0.6...0.9

        // When
        let disabled = LKOpacity.opacityDisabled
        let pressed = LKOpacity.opacityPressed

        // Then
        #expect(disabledRange.contains(disabled))
        #expect(pressedRange.contains(pressed))
    }

    /// 每個色彩 token 都能從 `all` 裡用 tokens.json 的原始名稱找到
    @Test
    func allColors_afterGeneration_enumerateEveryToken() {
        // Given

        // When
        let all = LKColorValues.all

        // Then
        #expect(all.count == 35)
        #expect(all["brand"] == LKColorValues.brand)
        #expect(all["bg-canvas"] == LKColorValues.bgCanvas)
    }

    /// 承諾過的每組前景與背景，在兩個主題都達到 WCAG AA 的對比度
    @Test(arguments: ContrastPair.promised, [false, true])
    func contrast_forEveryPromisedPair_meetsWCAGMinimum(pair: ContrastPair, isDark: Bool) {
        // Given
        let theme = isDark ? "dark" : "light"

        // When
        let ratio = contrastRatio(pair.foreground, pair.background, isDark: isDark)

        // Then
        #expect(
            ratio >= pair.minimum,
            "\(theme)：\(pair.name) 只有 \(ratio.formatted(.number.precision(.fractionLength(2))))"
                + ":1，需 ≥ \(pair.minimum)"
        )
    }
}

// MARK: - Nested Types

extension LKTokensTests {

    /// 一組承諾過要達到某個對比度的前景與背景
    struct ContrastPair: Sendable {

        // MARK: - Properties

        /// 這組配色的名稱，測試失敗時用它指出是哪一組
        let name: String

        /// 畫在上面的顏色
        let foreground: LKColorValue

        /// 襯在下面的顏色
        let background: LKColorValue

        /// 這組配色至少要達到的對比度
        let minimum: Double
    }
}

// MARK: - Computed Properties

extension LKTokensTests.ContrastPair {

    /// 設計系統文件裡承諾過對比度的所有配色
    ///
    /// - Note: `borderControl` 那組只要 3:1，因為它是靠邊框才辨識得出來的控制項，依 WCAG 1.4.11
    static var promised: [Self] {
        [
            Self(
                name: "textPrimary/bgSurface",
                foreground: LKColorValues.textPrimary,
                background: LKColorValues.bgSurface,
                minimum: 4.5
            ),
            Self(
                name: "textSecondary/bgSurface",
                foreground: LKColorValues.textSecondary,
                background: LKColorValues.bgSurface,
                minimum: 4.5
            ),
            Self(
                name: "textTertiary/bgSurface",
                foreground: LKColorValues.textTertiary,
                background: LKColorValues.bgSurface,
                minimum: 4.5
            ),
            Self(
                name: "textOnBrand/brand",
                foreground: LKColorValues.textOnBrand,
                background: LKColorValues.brand,
                minimum: 4.5
            ),
            Self(
                name: "brandInk/brandSubtle",
                foreground: LKColorValues.brandInk,
                background: LKColorValues.brandSubtle,
                minimum: 4.5
            ),
            Self(
                name: "dangerInk/dangerSubtle",
                foreground: LKColorValues.dangerInk,
                background: LKColorValues.dangerSubtle,
                minimum: 4.5
            ),
            Self(
                name: "textOnInverse/bgInverse",
                foreground: LKColorValues.textOnInverse,
                background: LKColorValues.bgInverse,
                minimum: 4.5
            ),
            Self(
                name: "borderControl/bgSurface",
                foreground: LKColorValues.borderControl,
                background: LKColorValues.bgSurface,
                minimum: 3.0
            ),
        ]
    }
}

// MARK: - Private Method

private extension LKTokensTests {

    /// 算出兩個顏色在某個主題下的對比度
    ///
    /// - Parameters:
    ///   - lhs: 其中一個顏色
    ///   - rhs: 另一個顏色
    ///   - isDark: 要算深色主題的值嗎
    /// - Returns: WCAG 定義的對比度，1 代表兩個顏色完全看不出差別
    func contrastRatio(_ lhs: LKColorValue, _ rhs: LKColorValue, isDark: Bool) -> Double {
        let first = luminance(lhs, isDark: isDark)
        let second = luminance(rhs, isDark: isDark)
        return (max(first, second) + 0.05) / (min(first, second) + 0.05)
    }

    /// 算出一個顏色在某個主題下的相對亮度，公式取自 WCAG 2
    ///
    /// - Parameters:
    ///   - value: 要計算的顏色
    ///   - isDark: 要算深色主題的值嗎
    /// - Returns: 0 到 1 之間的相對亮度
    func luminance(_ value: LKColorValue, isDark: Bool) -> Double {
        let channels = value.components(dark: isDark)
        return 0.2126 * linear(channels.red)
            + 0.7152 * linear(channels.green)
            + 0.0722 * linear(channels.blue)
    }

    /// 把一個顏色分量從螢幕上的數值換回線性的光量
    ///
    /// - Parameter component: 0 到 1 之間的顏色分量
    /// - Returns: 對應的線性光量
    func linear(_ component: Double) -> Double {
        if component <= 0.03928 {
            component / 12.92
        } else {
            pow((component + 0.055) / 1.055, 2.4)
        }
    }
}
