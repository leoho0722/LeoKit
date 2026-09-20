//
//  LKSpacing.generated.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

// LeoKit — 由 tokens/generate.mjs 產生，請勿手動編輯。
// 來源：tokens/tokens.json；要改 token 請改那裡，然後執行 `node tokens/generate.mjs`。

import Foundation

/// 元件之間與元件內部的間距刻度，名稱就是實際的 pt 數
///
/// - Note: 除了半階的 2，每一階都是 4 的倍數，不要自己插入中間值
public enum LKSpacing {

    // MARK: - Properties

    /// 顯式歸零，用來覆蓋繼承的間距
    public static let spacing0: CGFloat = 0

    /// 圖示與其標籤之間、badge 內的垂直微調
    public static let spacing2: CGFloat = 2

    /// 最小間距：標題與副標題之間、緊鄰的圖示群
    public static let spacing4: CGFloat = 4

    /// 按鈕內圖示與文字的間距、chip 之間、小尺寸按鈕的水平 padding 基礎
    public static let spacing8: CGFloat = 8

    /// 輸入框水平 padding、list row 垂直 padding、卡片內元素間距
    public static let spacing12: CGFloat = 12

    /// 預設版面邊距與卡片 padding
    ///
    /// - Note: iOS list 的標準 leading inset 也是 16
    public static let spacing16: CGFloat = 16

    /// 較寬鬆的卡片 padding、sheet 內距
    public static let spacing20: CGFloat = 20

    /// 區塊之間的間距、sheet 的上下內距
    public static let spacing24: CGFloat = 24

    /// 主要區段之間的分隔
    public static let spacing32: CGFloat = 32

    /// 頁面標題與第一個區塊之間
    public static let spacing40: CGFloat = 40

    /// 大區段分隔、空狀態的上下留白
    public static let spacing48: CGFloat = 48

    /// 頁面級留白，僅用於 Web 寬版面與空狀態
    public static let spacing64: CGFloat = 64
}
