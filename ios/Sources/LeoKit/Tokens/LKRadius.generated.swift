//
//  LKRadius.generated.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

// LeoKit — 由 tokens/generate.mjs 產生，請勿手動編輯。
// 來源：tokens/tokens.json；要改 token 請改那裡，然後執行 `node tokens/generate.mjs`。

import Foundation

/// 圓角半徑的刻度，單位為 pt
///
/// - Note: iOS 請透過 `LKShape` 取用，它已經套上 Apple 平台該用的連續曲線圓角
public enum LKRadius {

    // MARK: - Properties

    /// 滿版元素：全寬圖片、貼齊邊緣的分隔區塊
    public static let radiusNone: CGFloat = 0

    /// checkbox、小 badge、內嵌 code
    public static let radiusXs: CGFloat = 4

    /// 小尺寸按鈕（control-h-sm）、segmented control 內的選取指示、toast 內的動作
    ///
    /// - Note: filter chip 用 radius-pill
    public static let radiusSm: CGFloat = 6

    /// 預設半徑：按鈕、輸入框、小卡片
    public static let radiusMd: CGFloat = 10

    /// 卡片、群組化列表容器、彈出選單
    public static let radiusLg: CGFloat = 14

    /// bottom sheet 與 dialog 的上緣、大型特色卡片
    public static let radiusXl: CGFloat = 20

    /// 全螢幕 sheet 上緣、行動端最大圓角
    public static let radius2xl: CGFloat = 28

    /// 膠囊按鈕、filter chip、狀態 badge、avatar
    ///
    /// - Note: Android FAB 請用 radius-lg 而非 pill
    public static let radiusPill: CGFloat = 999
}
