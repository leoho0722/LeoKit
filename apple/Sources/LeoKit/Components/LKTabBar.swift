//
//  LKTabBar.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// App 的主導覽：在 3 到 5 個平行的頂層區塊之間切換
///
/// - Note: 這是系統 `TabView` 的薄包裝，只把品牌色與底色套上去；圖示、切換動畫與手勢都留給系統
/// - Note: 內容用系統的 `Tab` 寫，圖示請用 SF Symbols 成對的實心與線條變體，選到時系統會自動換實心
/// - Note: `Tab` 遵循的是 `TabContent` 而不是 `View`，所以這裡收的是 `@TabContentBuilder` 而非 `@ViewBuilder`
/// - Note: 超過 5 個頂層區塊時不要塞進來，改用側邊欄或抽屜
/// - Note: 這裡只管主導覽。同一層級的內容切換請用 `LKTabs`
public struct LKTabBar<Selection: Hashable, Content: TabContent<Selection>>: View {

    // MARK: - Properties

    /// 每一個頂層區塊，用系統的 `Tab` 撰寫
    private let content: Content

    /// 目前在哪一個頂層區塊，由呼叫端持有
    @Binding private var selection: Selection

    // MARK: - Init

    /// 建立主導覽
    ///
    /// - Parameters:
    ///   - selection: 目前在哪一個頂層區塊
    ///   - content: 每一個頂層區塊，用系統的 `Tab` 撰寫
    public init(
        selection: Binding<Selection>,
        @TabContentBuilder<Selection> content: () -> Content
    ) {
        self._selection = selection
        self.content = content()
    }

    // MARK: - Body

    /// 主導覽本體，樣式與手感都交給系統
    public var body: some View {
        TabView(selection: $selection) {
            content
        }
        .tint(LKColor.brand)
    }
}

// MARK: - Preview

#Preview("主導覽") {
    @Previewable @State var section = "subscriptions"

    LKTabBar(selection: $section) {
        Tab("訂閱", systemImage: "list.bullet", value: "subscriptions") {
            Text("訂閱清單")
                .font(LKFont.body)
        }
        Tab("統計", systemImage: "chart.pie", value: "stats") {
            Text("支出統計")
                .font(LKFont.body)
        }
        Tab("設定", systemImage: "gearshape", value: "settings") {
            Text("設定")
                .font(LKFont.body)
        }
    }
}
