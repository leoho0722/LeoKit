//
//  LKShape.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

import SwiftUI

/// 各級圓角，直接當成背景或外框的形狀使用
///
/// - Note: Apple 平台一律用連續曲線圓角，轉角比正圓弧柔和；數值與 Android 相同但曲線不同
/// - Note: 只要半徑數字不要形狀時改讀 `LKRadius`
public enum LKShape {

    // MARK: - Properties

    /// 不做圓角：滿版圖片、貼齊邊緣的分隔區塊
    public static let none = RoundedRectangle(cornerRadius: LKRadius.radiusNone, style: .continuous)

    /// checkbox、小標記、內嵌的程式碼片段
    public static let xs = RoundedRectangle(cornerRadius: LKRadius.radiusXs, style: .continuous)

    /// 小尺寸按鈕、分段控制項裡的選取指示
    public static let sm = RoundedRectangle(cornerRadius: LKRadius.radiusSm, style: .continuous)

    /// 預設圓角：按鈕、輸入框、小卡片
    public static let md = RoundedRectangle(cornerRadius: LKRadius.radiusMd, style: .continuous)

    /// 卡片、群組列表容器、彈出選單
    public static let lg = RoundedRectangle(cornerRadius: LKRadius.radiusLg, style: .continuous)

    /// 由下往上推出的面板與對話框的上緣、大型特色卡片
    public static let xl = RoundedRectangle(cornerRadius: LKRadius.radiusXl, style: .continuous)

    /// 全螢幕面板的上緣，行動裝置上最大的圓角
    public static let xxl = RoundedRectangle(cornerRadius: LKRadius.radius2xl, style: .continuous)
}
