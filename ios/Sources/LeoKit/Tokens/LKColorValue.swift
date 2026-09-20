//
//  LKColorValue.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

import SwiftUI
import UIKit

/// 一個顏色在淺色與深色主題下各自的值
///
/// - Note: 產生器會把 tokens.json 的色值攤平成這個型別，畫面上要用的 `LKColor` 再由它建出來
/// - Note: 測試與工具可以直接讀 `light` 與 `dark`，不必經過系統的動態換色機制
public struct LKColorValue: Sendable, Hashable {

    // MARK: - Properties

    /// 淺色主題下的顏色，寫成 `0xRRGGBB`
    public let light: UInt32

    /// 淺色主題下的透明度，0 是看不見、1 是完全不透明
    public let lightAlpha: Double

    /// 深色主題下的顏色，寫成 `0xRRGGBB`
    public let dark: UInt32

    /// 深色主題下的透明度，0 是看不見、1 是完全不透明
    public let darkAlpha: Double

    // MARK: - Init

    /// 建立一個色彩 token 的值；沒特別指定透明度時兩個主題都是完全不透明
    ///
    /// - Parameters:
    ///   - light: 淺色主題下的顏色，寫成 `0xRRGGBB`
    ///   - lightAlpha: 淺色主題下的透明度
    ///   - dark: 深色主題下的顏色，寫成 `0xRRGGBB`
    ///   - darkAlpha: 深色主題下的透明度
    public init(light: UInt32, lightAlpha: Double = 1, dark: UInt32, darkAlpha: Double = 1) {
        self.light = light
        self.lightAlpha = lightAlpha
        self.dark = dark
        self.darkAlpha = darkAlpha
    }
}

// MARK: - Nested Types

extension LKColorValue {

    /// 一個主題下拆開的顏色，四個數都在 0 到 1 之間
    struct Channels: Sendable, Hashable {

        // MARK: - Properties

        /// 紅色的多寡
        let red: Double

        /// 綠色的多寡
        let green: Double

        /// 藍色的多寡
        let blue: Double

        /// 透明度
        let alpha: Double
    }
}

// MARK: - Computed Properties

extension LKColorValue {

    /// 可以直接畫在畫面上的顏色，會跟著系統的淺色或深色外觀自動換色
    ///
    /// - Note: 換色由 `UIColor` 的 dynamic provider 負責，拿到的是真正的動態色而不是當下的快照
    public var color: Color {
        Color(uiColor: UIColor { traits in
            let channels = components(dark: traits.userInterfaceStyle == .dark)
            return UIColor(
                red: CGFloat(channels.red),
                green: CGFloat(channels.green),
                blue: CGFloat(channels.blue),
                alpha: CGFloat(channels.alpha)
            )
        })
    }
}

// MARK: - Internal Method

extension LKColorValue {

    /// 取出某個主題下拆開的顏色，用來算對比度
    ///
    /// - Parameter isDark: 要取深色主題的值嗎
    /// - Returns: 該主題下的紅、綠、藍與透明度
    func components(dark isDark: Bool) -> Channels {
        let hex = isDark ? dark : light
        return Channels(
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            alpha: isDark ? darkAlpha : lightAlpha
        )
    }
}
