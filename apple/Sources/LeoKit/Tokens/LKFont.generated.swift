//
//  LKFont.generated.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

// LeoKit — 由 tokens/generate.mjs 產生，請勿手動編輯。
// 來源：tokens/tokens.json；要改 token 請改那裡，然後執行 `node tokens/generate.mjs`。

import SwiftUI

/// 畫面上每一種文字的字級
///
/// - Note: 一律綁在系統的文字樣式上，使用者把字放大時會跟著放大，所以不寫死 pt 數
/// - Note: tokens.json 裡的 px 只是 Web 的值與設計稿的參考值
public enum LKFont {

    // MARK: - Properties

    /// 頁面最大標題，一頁一個
    ///
    /// - Note: iOS: .largeTitle / Android: displaySmall
    public static let display: Font = Font.largeTitle

    /// 區段主標題與 large title navigation bar
    ///
    /// - Note: iOS: .title1 / Android: headlineMedium
    public static let title1: Font = Font.title

    /// 卡片群組標題、sheet 標題
    ///
    /// - Note: iOS: .title2 / Android: headlineSmall
    public static let title2: Font = Font.title2

    /// 卡片標題與小節標題
    ///
    /// - Note: iOS: .title3（20pt）/ Android: titleLarge（22sp）— 行動端放大到平台值，Web 用 18px
    public static let title3: Font = Font.title3

    /// list row 的主要文字、強調的單行標題
    ///
    /// - Note: iOS: .headline / Android: titleMedium
    public static let headline: Font = Font.headline

    /// 預設內文
    ///
    /// - Note: iOS: .body（17pt）/ Android: bodyLarge（16sp）/ Web: 16px
    /// - Note: 行動端一律交給 Dynamic Type／字級設定，不要寫死
    public static let body: Font = Font.body

    /// 內文中的強調字與金額
    ///
    /// - Note: 等寬數字請一併開啟 font-variant-numeric: tabular-nums
    public static let bodyStrong: Font = Font.body.weight(.semibold)

    /// 密度較高的內文，例如卡片內說明
    ///
    /// - Note: iOS: .callout / Android: bodyMedium
    public static let callout: Font = Font.callout

    /// 列表分組標題、欄位標籤
    ///
    /// - Note: iOS: .subheadline / Android: titleSmall
    public static let subhead: Font = Font.subheadline

    /// 輔助說明、TextField helper text
    ///
    /// - Note: iOS: .footnote / Android: bodySmall
    /// - Note: 搭配 text-secondary，不要用 text-tertiary 放在 bg-subtle 上
    public static let footnote: Font = Font.footnote

    /// 最小可用字級，僅限 metadata 與時間戳
    ///
    /// - Note: iOS: .caption1 / Android: labelSmall
    /// - Note: 不要用於可讀性重要的內容
    public static let caption: Font = Font.caption

    /// 大尺寸按鈕文字（control-h-lg）
    public static let labelLg: Font = Font.body.weight(.semibold)

    /// 預設按鈕、segmented control、tab 文字
    ///
    /// - Note: iOS: 按鈕的 .body semibold / Android: labelLarge
    public static let label: Font = Font.subheadline.weight(.semibold)

    /// badge 與小尺寸按鈕文字
    ///
    /// - Note: 全大寫英文時保留這個字距，中文不要加字距
    public static let labelSm: Font = Font.caption.weight(.semibold)

    /// 程式碼、token 名稱、ID 與短碼
    ///
    /// - Note: 搭配 bg-inset 或 bg-subtle 作底
    public static let code: Font = Font.system(.footnote, design: .monospaced)
}
