//
//  LKListRow.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

import SwiftUI

/// 列表裡的一列
///
/// - Note: 標題與副標題都只有一行，放不下就以省略號截斷；需要多行的內容不該用這個元件
/// - Note: 整列是一個可聚焦的單位，朗讀時會把標題、副標題與尾端數值念成一句話
public struct LKListRow<Trailing: View>: View {

    // MARK: - Properties

    /// 這一列目前是否被選取，選取時底色與標題顏色都會換成品牌色
    private let selected: Bool

    /// 尾端是否畫一個往右的箭頭，表示點下去會換頁
    private let showsChevron: Bool

    /// 標題下方的一行說明，不需要時是 nil
    private let subtitle: String?

    /// 最前面的圖示名稱，取自 SF Symbols；不放圖示時是 nil
    private let systemImage: String?

    /// 這一列的主要文字
    private let title: String

    /// 尾端自訂的內容，例如開關或按鈕，不需要時傳 `EmptyView`
    private let trailing: Trailing

    /// 尾端靠右對齊的數值或狀態文字，不需要時是 nil
    private let value: String?

    // MARK: - Init

    /// 建立列表裡的一列
    ///
    /// - Parameters:
    ///   - title: 這一列的主要文字
    ///   - subtitle: 標題下方的一行說明
    ///   - value: 尾端靠右對齊的數值或狀態文字
    ///   - systemImage: 最前面的圖示名稱，取自 SF Symbols
    ///   - showsChevron: 尾端是否畫一個往右的箭頭
    ///   - selected: 這一列目前是否被選取
    ///   - trailing: 尾端自訂的內容
    public init(
        _ title: String,
        subtitle: String? = nil,
        value: String? = nil,
        systemImage: String? = nil,
        showsChevron: Bool = false,
        selected: Bool = false,
        @ViewBuilder trailing: () -> Trailing
    ) {
        self.title = title
        self.subtitle = subtitle
        self.value = value
        self.systemImage = systemImage
        self.showsChevron = showsChevron
        self.selected = selected
        self.trailing = trailing()
    }

    // MARK: - Body

    /// 一列的骨架：由左而右是圖示、標題區、數值、自訂內容、箭頭
    public var body: some View {
        HStack(spacing: LKSpacing.spacing12) {
            leadingIcon

            titles

            valueText

            trailing

            chevron
        }
        .padding(.horizontal, LKSpacing.spacing16)
        .padding(.vertical, LKSpacing.spacing12)
        .frame(minHeight: LKSize.tapMinIos)
        .background(backgroundColor)
        .contentShape(.rect)
        .accessibilityElement(children: .combine)
    }
}

// MARK: - Private Views

private extension LKListRow {

    /// 最前面的圖示，沒給名稱時不佔位置
    @ViewBuilder
    var leadingIcon: some View {
        if let systemImage {
            Image(systemName: systemImage)
                .frame(width: LKSize.iconLg)
                .font(.system(size: LKSize.iconMd))
                .foregroundStyle(LKColor.brand)
        }
    }

    /// 標題與副標題，兩行都只顯示一行的長度
    var titles: some View {
        VStack(alignment: .leading, spacing: Layout.titleSpacing) {
            titleText

            subtitleText
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    /// 這一列的主要文字，被選取時換成品牌色
    var titleText: some View {
        Text(title)
            .font(LKFont.headline)
            .foregroundStyle(titleColor)
            .lineLimit(1)
    }

    /// 標題下方的說明，沒給時不佔位置
    @ViewBuilder
    var subtitleText: some View {
        if let subtitle {
            Text(subtitle)
                .font(LKFont.footnote)
                .foregroundStyle(LKColor.textSecondary)
                .lineLimit(1)
        }
    }

    /// 尾端靠右的數值，數字用等寬字避免跳動
    @ViewBuilder
    var valueText: some View {
        if let value {
            Text(value)
                .font(LKFont.callout)
                .foregroundStyle(LKColor.textSecondary)
                .monospacedDigit()
        }
    }

    /// 尾端往右的箭頭，表示點下去會換頁
    @ViewBuilder
    var chevron: some View {
        if showsChevron {
            Image(systemName: "chevron.right")
                .font(.system(size: LKSize.iconSm, weight: .semibold))
                .foregroundStyle(LKColor.textTertiary)
        }
    }
}

// MARK: - Nested Types

extension LKListRow {

    /// 這個元件自己的版面數值，只放沒有對應 token 的尺寸
    ///
    /// - Note: 一律 computed 不用 stored —— `Layout` 巢狀在泛型型別裡時
    ///   static stored property 不合法，八個元件統一寫法才不用每次判斷
    private enum Layout {

        // MARK: - Computed Properties

        /// 標題與副標題之間的距離，比 spacing-4 更窄，讓兩行讀起來是一組
        static var titleSpacing: CGFloat { 2 }
    }
}

// MARK: - Computed Properties

private extension LKListRow {

    /// 整列的底色
    var backgroundColor: Color {
        if selected {
            LKColor.brandSubtle
        } else {
            LKColor.bgSurface
        }
    }

    /// 主要文字的顏色
    var titleColor: Color {
        if selected {
            LKColor.brandInk
        } else {
            LKColor.textPrimary
        }
    }
}

// MARK: - Convenience

extension LKListRow where Trailing == EmptyView {

    /// 建立尾端沒有自訂內容的一列
    ///
    /// - Parameters:
    ///   - title: 這一列的主要文字
    ///   - subtitle: 標題下方的一行說明
    ///   - value: 尾端靠右對齊的數值或狀態文字
    ///   - systemImage: 最前面的圖示名稱，取自 SF Symbols
    ///   - showsChevron: 尾端是否畫一個往右的箭頭
    ///   - selected: 這一列目前是否被選取
    public init(
        _ title: String,
        subtitle: String? = nil,
        value: String? = nil,
        systemImage: String? = nil,
        showsChevron: Bool = false,
        selected: Bool = false
    ) {
        self.init(
            title,
            subtitle: subtitle,
            value: value,
            systemImage: systemImage,
            showsChevron: showsChevron,
            selected: selected
        ) {
            EmptyView()
        }
    }
}

// MARK: - Preview

#Preview("各種組合") {
    VStack(spacing: 0) {
        LKListRow("通知", subtitle: "推播與電子郵件", systemImage: "bell", showsChevron: true)

        LKListRow("已用空間", value: "12.4 GB")

        LKListRow("深色模式", systemImage: "moon") {
            Toggle("深色模式", isOn: .constant(true))
                .labelsHidden()
        }

        LKListRow("目前方案", value: "Pro", selected: true)
    }
    .background(LKColor.bgCanvas)
}
