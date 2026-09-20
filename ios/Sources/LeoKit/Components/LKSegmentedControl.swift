//
//  LKSegmentedControl.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 在少數幾個互斥的檢視或篩選條件之間切換
///
/// - Note: 這是系統分段控制項的薄包裝，只把品牌色套上去，不自繪：自繪會失去平台的手感
/// - Note: 放 2 到 4 個選項；超過就改用可以左右捲動的 `LKTabs`
/// - Note: 切換後下方內容要立刻改變，不要再要求使用者按「套用」
/// - Note: 不要拿它當導覽列，換頁請用平台的 tab bar 或 navigation bar
/// - Note: 選項標籤用名詞而不是動詞，長度盡量接近
public struct LKSegmentedControl<Selection: Hashable, Content: View>: View {

    // MARK: - Properties

    /// 每一段的內容，每個子項都要用 `.tag()` 標上自己的值
    private let content: Content

    /// 目前選到哪一段，由呼叫端持有
    @Binding private var selection: Selection

    /// 唸給螢幕閱讀器的說明，說明這一排在切換什麼
    private let title: String

    // MARK: - Init

    /// 建立一排分段控制項
    ///
    /// - Parameters:
    ///   - title: 說明這一排在切換什麼，只給螢幕閱讀器聽
    ///   - selection: 目前選到哪一段
    ///   - content: 每一段的內容，每個子項都要用 `.tag()` 標上自己的值
    public init(
        _ title: String,
        selection: Binding<Selection>,
        @ViewBuilder content: () -> Content
    ) {
        self.title = title
        self._selection = selection
        self.content = content()
    }

    // MARK: - Body

    /// 分段控制項本體，樣式與手感都交給系統
    public var body: some View {
        Picker(title, selection: $selection) {
            content
        }
        .pickerStyle(.segmented)
        .tint(LKColor.brand)
        .accessibilityLabel(title)
    }
}

// MARK: - Preview

#Preview("訂閱狀態") {
    @Previewable @State var filter = "all"

    VStack(spacing: LKSpacing.spacing16) {
        LKSegmentedControl("訂閱狀態", selection: $filter) {
            Text("全部").tag("all")
            Text("使用中").tag("active")
            Text("已取消").tag("cancelled")
        }

        Text("目前篩選：\(filter)")
            .font(LKFont.footnote)
            .foregroundStyle(LKColor.textSecondary)
    }
    .padding(LKSpacing.spacing16)
}
