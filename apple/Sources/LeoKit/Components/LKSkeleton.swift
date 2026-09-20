//
//  LKSkeleton.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 內容還沒來時的佔位方塊
///
/// - Note: 純色不掃光。掃光動畫會吸引注意力到還沒有內容的地方
/// - Note: 只在第一次載入時用，重新整理請保留舊內容
/// - Note: 佔位方塊對螢幕閱讀器隱藏，載入狀態由外層的 `accessibilityLabel` 說明
/// - Note: 要把現成畫面整片打成佔位時，系統的 `.redacted(reason: .placeholder)` 更省事
public struct LKSkeleton: View {

    // MARK: - Properties

    /// 佔位方塊的形狀
    private let shape: LKSkeletonShape

    /// 寬度；nil 表示撐滿可用寬度
    private let width: CGFloat?

    // MARK: - Init

    /// 建立一個佔位方塊
    ///
    /// - Parameters:
    ///   - shape: 佔位方塊的形狀
    ///   - width: 寬度；不給就撐滿可用寬度
    public init(_ shape: LKSkeletonShape = .line, width: CGFloat? = nil) {
        self.shape = shape
        self.width = width
    }

    // MARK: - Body

    /// 一塊圓角的填色方塊
    public var body: some View {
        RoundedRectangle(cornerRadius: shape.radius, style: .continuous)
            .fill(LKColor.bgSubtle)
            .frame(width: resolvedWidth, height: shape.height)
            .accessibilityHidden(true)
    }
}

// MARK: - Computed Properties

private extension LKSkeleton {

    /// 實際寬度；圓形沒給寬度時用它自己的高度，維持正圓
    var resolvedWidth: CGFloat? {
        if let width {
            return width
        }
        if shape == .circle {
            return shape.height
        }
        return nil
    }
}

// MARK: - Preview

#Preview("載入中的列表") {
    VStack(alignment: .leading, spacing: LKSpacing.spacing12) {
        HStack(spacing: LKSpacing.spacing12) {
            LKSkeleton(.circle)

            VStack(alignment: .leading, spacing: LKSpacing.spacing8) {
                LKSkeleton(.title, width: 160)

                LKSkeleton(width: 220)
            }
        }

        LKSkeleton()

        LKSkeleton(width: 180)
    }
    .padding(LKSpacing.spacing16)
    .accessibilityElement()
    .accessibilityLabel("正在載入訂閱清單")
}
