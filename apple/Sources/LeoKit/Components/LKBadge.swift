//
//  LKBadge.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

import SwiftUI

/// 不能點的狀態標記，例如「已發布」或未讀數量
///
/// - Note: 要讓使用者點的標籤請改用 Chip
/// - Note: `label` 必須自己說明狀態，因為有些人看不出顏色的差別
public struct LKBadge: View {

    // MARK: - Properties

    /// 標記上的文字，要能單獨說明狀態
    private let label: String

    /// 文字前面是否改畫一個小圓點
    private let showsDot: Bool

    /// 文字前面的圖示名稱，取自 SF Symbols；不放圖示時是 nil
    private let systemImage: String?

    /// 要傳達的意思，決定底色與文字顏色
    private let tone: LKBadgeTone

    // MARK: - Init

    /// 建立一個狀態標記
    ///
    /// - Parameters:
    ///   - label: 標記上的文字
    ///   - tone: 要傳達的意思
    ///   - systemImage: 文字前面的圖示名稱，取自 SF Symbols
    ///   - showsDot: 文字前面是否改畫一個小圓點
    public init(
        _ label: String,
        tone: LKBadgeTone = .neutral,
        systemImage: String? = nil,
        showsDot: Bool = false
    ) {
        self.label = label
        self.tone = tone
        self.systemImage = systemImage
        self.showsDot = showsDot
    }

    // MARK: - Body

    /// 標記的骨架：前面是小圓點或圖示，後面是文字，整個包在膠囊底色裡
    public var body: some View {
        HStack(spacing: LKSpacing.spacing4) {
            leading

            labelText
        }
        .padding(.horizontal, LKSpacing.spacing8)
        .padding(.vertical, Layout.verticalPadding)
        .frame(minHeight: Layout.minHeight)
        .foregroundStyle(foreground)
        .background(background, in: .capsule)
    }
}

// MARK: - Private Views

private extension LKBadge {

    /// 文字前面的小圓點或圖示，兩個都不要時不佔位置
    @ViewBuilder
    var leading: some View {
        if showsDot {
            Circle()
                .frame(width: Layout.dotSize, height: Layout.dotSize)
        } else if let systemImage {
            Image(systemName: systemImage)
                .font(.system(size: LKSize.iconSm))
        }
    }

    /// 標記上的文字
    var labelText: some View {
        Text(label)
            .font(LKFont.labelSm)
    }
}

// MARK: - Nested Types

extension LKBadge {

    /// 標記自己的版面數值，只放沒有對應 token 的尺寸
    ///
    /// - Note: 一律 computed 不用 stored —— `Layout` 巢狀在泛型型別裡時
    ///   static stored property 不合法，八個元件統一寫法才不用每次判斷
    private enum Layout {

        // MARK: - Computed Properties

        /// 小圓點的直徑
        static var dotSize: CGFloat { 6 }

        /// 文字上下的內距，比 spacing-4 更窄，讓標記維持扁平
        static var verticalPadding: CGFloat { 2 }

        /// 最小高度，讓長短不同的標記看起來一樣高
        static var minHeight: CGFloat { 20 }
    }
}

// MARK: - Computed Properties

private extension LKBadge {

    /// 膠囊的底色
    var background: Color {
        switch tone {
        case .neutral:
            LKColor.bgSubtle
        case .brand:
            LKColor.brandSubtle
        case .success:
            LKColor.successSubtle
        case .warning:
            LKColor.warningSubtle
        case .danger:
            LKColor.dangerSubtle
        case .count:
            LKColor.danger
        }
    }

    /// 文字、圖示與小圓點的顏色
    var foreground: Color {
        switch tone {
        case .neutral:
            LKColor.textSecondary
        case .brand:
            LKColor.brandInk
        case .success:
            LKColor.successInk
        case .warning:
            LKColor.warningInk
        case .danger:
            LKColor.dangerInk
        case .count:
            LKColor.textOnDanger
        }
    }
}

// MARK: - Preview

#Preview("各種語意") {
    VStack(alignment: .leading, spacing: LKSpacing.spacing12) {
        LKBadge("草稿")

        LKBadge("已發布", tone: .success, systemImage: "checkmark.circle.fill")

        LKBadge("即將到期", tone: .warning, showsDot: true)

        LKBadge("12", tone: .count)
    }
    .padding(LKSpacing.spacing16)
}
