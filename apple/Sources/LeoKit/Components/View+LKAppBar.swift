//
//  View+LKAppBar.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

// MARK: - LKAppBar

extension View {

    /// 把 LeoKit 的外觀套到系統的導覽列上：標題、標題大小，以及導覽列底色
    ///
    /// iOS 的導覽列是由 `NavigationStack` 提供的，返回鍵與邊緣滑動返回都由它負責，
    /// 所以這裡刻意不自繪一條列出來，只設定標題與外觀。
    ///
    /// - Parameters:
    ///   - title: 這個畫面在說什麼，不要放 App 名稱
    ///   - isLarge: 是否用大標題；只有該區塊的第一層畫面才用大標題
    /// - Returns: 套好導覽列外觀的畫面
    /// - Note: 安全區的上內距由 `NavigationStack` 處理，呼叫端不必自己加
    /// - Note: 標題列的圖示動作最多兩個，更多請收進 `LKMenu`
    public func lkAppBar(_ title: String, isLarge: Bool = false) -> some View {
        modifier(LKAppBarModifier(title: title, isLarge: isLarge))
    }
}

// MARK: - LKAppBarModifier

/// 實作 `lkAppBar(_:isLarge:)` 的修飾子，把平台差異收在一個地方
private struct LKAppBarModifier {

    // MARK: - Properties

    /// 是否用大標題
    let isLarge: Bool

    /// 這個畫面的標題
    let title: String
}

// MARK: - ViewModifier

extension LKAppBarModifier: ViewModifier {

    /// 套上標題與導覽列底色；標題大小只有 iOS 有這個概念
    ///
    /// - Parameter content: 被修飾的畫面
    /// - Returns: 套好導覽列外觀的畫面
    func body(content: Content) -> some View {
        content
            .navigationTitle(title)
            .toolbarBackground(LKColor.bgSurface, for: .automatic)
            .toolbarTitleDisplayMode(isLarge ? .large : .inline)
    }
}
