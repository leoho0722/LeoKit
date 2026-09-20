//
//  LKProgress.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 一條進度軌道
///
/// - Note: 這是系統 `ProgressView` 的薄包裝，只把品牌色套上去
/// - Note: 知道進度就給 `value`，不知道還要多久就不要給，它會變成不確定狀態
/// - Note: 進度只能往前，不要倒退；會倒退的數字用文字表達
/// - Note: 整頁載入請用 `LKSkeleton`，不要用一條進度條代表整個畫面
public struct LKProgress: View {

    // MARK: - Properties

    /// 說明在進行什麼，唸給螢幕閱讀器聽
    private let title: String

    /// 是否為成功語氣，用於已完成的額度或用量
    private let usesSuccessTone: Bool

    /// 目前進度，範圍 0 到 1；不知道還要多久時是 nil
    private let value: Double?

    // MARK: - Init

    /// 建立一條進度軌道
    ///
    /// - Parameters:
    ///   - title: 說明在進行什麼
    ///   - value: 目前進度，範圍 0 到 1；不知道還要多久時傳 nil
    ///   - usesSuccessTone: 是否為成功語氣
    public init(_ title: String, value: Double? = nil, usesSuccessTone: Bool = false) {
        self.title = title
        self.value = value
        self.usesSuccessTone = usesSuccessTone
    }

    // MARK: - Body

    /// 軌道本體，確定與不確定兩種狀態都交給系統
    public var body: some View {
        bar
            .progressViewStyle(.linear)
            .tint(usesSuccessTone ? LKColor.success : LKColor.brand)
            .accessibilityLabel(title)
    }
}

// MARK: - Private Views

private extension LKProgress {

    /// 知道進度時畫實際比例，不知道時讓系統畫不確定狀態
    @ViewBuilder
    var bar: some View {
        if let value {
            ProgressView(value: value.clampedToUnitRange, total: 1)
        } else {
            ProgressView()
        }
    }
}

// MARK: - Preview

#Preview("三種進度") {
    VStack(alignment: .leading, spacing: LKSpacing.spacing16) {
        LKProgress("匯入進度", value: 0.42)

        LKProgress("本月額度", value: 0.9, usesSuccessTone: true)

        LKProgress("同步中")
    }
    .padding(LKSpacing.spacing16)
}
