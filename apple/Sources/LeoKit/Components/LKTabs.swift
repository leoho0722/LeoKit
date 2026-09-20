//
//  LKTabs.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 在同一層級的幾個內容區之間切換的頂部 tab 列
///
/// - Note: iOS 沒有標準的頂部 tab，所以這一列是自繪的；切換頁面請改用 `LKTabBar`
/// - Note: 切換後的內容由呼叫端渲染。搭配 `TabView` 的 `.tabViewStyle(.page)` 才能左右滑動切換
/// - Note: 只有 2 到 3 個 tab 時可以用 `isFilled` 平分寬度；更多就讓它橫向捲動
/// - Note: 選到哪一個同時由底線與文字顏色表達，不只靠顏色
public struct LKTabs<Value: Hashable & Sendable>: View {

    // MARK: - Properties

    /// 這一排要顯示哪些 tab
    private let items: [LKTab<Value>]

    /// 是否撐滿容器並平分寬度
    private let isFilled: Bool

    /// 目前選到哪一個，由呼叫端持有
    @Binding private var selection: Value

    /// 唸給螢幕閱讀器的說明，說明這一排在切換什麼
    private let title: String

    // MARK: - Init

    /// 建立一排頂部 tab
    ///
    /// - Parameters:
    ///   - title: 說明這一排在切換什麼，只給螢幕閱讀器聽
    ///   - items: 這一排要顯示哪些 tab
    ///   - selection: 目前選到哪一個
    ///   - isFilled: 是否撐滿容器並平分寬度
    public init(
        _ title: String,
        items: [LKTab<Value>],
        selection: Binding<Value>,
        isFilled: Bool = false
    ) {
        self.title = title
        self.items = items
        self._selection = selection
        self.isFilled = isFilled
    }

    // MARK: - Body

    /// 一排可以橫向捲動的 tab，底下有一條與整排同寬的分隔線
    public var body: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 0) {
                ForEach(items) { item in
                    tab(for: item)
                }
            }
            .frame(maxWidth: isFilled ? .infinity : nil)
        }
        .scrollIndicators(.hidden)
        .scrollDisabled(isFilled)
        .background(alignment: .bottom) {
            Rectangle()
                .fill(LKColor.borderSubtle)
                .frame(height: LKSize.hairline)
        }
        .accessibilityLabel(title)
    }
}

// MARK: - Private Views

private extension LKTabs {

    /// 單一個 tab：文字、圖示、數量標記，選到時底下畫一條品牌色的線
    ///
    /// - Parameter item: 要畫的 tab
    /// - Returns: 可以點的 tab 按鈕
    func tab(for item: LKTab<Value>) -> some View {
        Button {
            selection = item.value
        } label: {
            HStack(spacing: LKSpacing.spacing4) {
                tabIcon(for: item)

                Text(item.label)
                    .font(LKFont.label)

                tabBadge(for: item)
            }
            .padding(.horizontal, LKSpacing.spacing12)
            .frame(maxWidth: isFilled ? .infinity : nil, minHeight: LKSize.controlHMd)
            .foregroundStyle(item.value == selection ? LKColor.brand : LKColor.textSecondary)
            .overlay(alignment: .bottom) {
                indicator(isSelected: item.value == selection)
            }
            .contentShape(.rect)
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(item.value == selection ? [.isButton, .isSelected] : .isButton)
    }

    /// tab 文字前面的圖示，沒給名稱時不佔位置
    ///
    /// - Parameter item: 要畫的 tab
    /// - Returns: 圖示，或沒有圖示時的空白
    @ViewBuilder
    func tabIcon(for item: LKTab<Value>) -> some View {
        if let systemImage = item.systemImage {
            Image(systemName: systemImage)
                .font(.system(size: LKSize.iconSm))
        }
    }

    /// tab 尾端的數量標記，沒給時不佔位置
    ///
    /// - Parameter item: 要畫的 tab
    /// - Returns: 數量標記，或沒有標記時的空白
    @ViewBuilder
    func tabBadge(for item: LKTab<Value>) -> some View {
        if let badge = item.badge {
            LKBadge(badge)
        }
    }

    /// 選到時畫在 tab 底下的那條線，沒選到時留同樣高度的透明區塊避免文字跳動
    ///
    /// - Parameter isSelected: 這個 tab 目前是否被選到
    /// - Returns: 底線
    func indicator(isSelected: Bool) -> some View {
        Rectangle()
            .fill(isSelected ? LKColor.brand : Color.clear)
            .frame(height: Layout.indicatorHeight)
    }
}

// MARK: - Nested Types

extension LKTabs {

    /// 這個元件自己的版面數值，只放沒有對應 token 的尺寸
    ///
    /// - Note: 一律 computed 不用 stored —— `Layout` 巢狀在泛型型別裡時
    ///   static stored property 不合法，八個元件統一寫法才不用每次判斷
    private enum Layout {

        // MARK: - Computed Properties

        /// 選取指示線的高度
        static var indicatorHeight: CGFloat { 2 }
    }
}

// MARK: - Preview

#Preview("訂閱分類") {
    @Previewable @State var selected = "all"

    VStack(spacing: LKSpacing.spacing16) {
        LKTabs(
            "訂閱分類",
            items: [
                LKTab("全部", value: "all"),
                LKTab("待處理", value: "todo", badge: "2"),
                LKTab("已取消", value: "cancelled", systemImage: "xmark.circle"),
            ],
            selection: $selected
        )

        Text("目前分類：\(selected)")
            .font(LKFont.footnote)
            .foregroundStyle(LKColor.textSecondary)
    }
    .padding(.vertical, LKSpacing.spacing16)
}
