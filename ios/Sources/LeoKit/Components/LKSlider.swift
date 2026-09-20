//
//  LKSlider.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 在一個連續範圍裡挑一個值
///
/// - Note: 這是系統 `Slider` 的薄包裝，拖曳手感、鍵盤與輔助使用行為都留給系統
/// - Note: 目前的值一定要用文字顯示在旁邊：只有把手位置的滑桿沒有人看得懂
/// - Note: 精確的數字用 `LKTextField` 或 `LKStepper`，滑桿適合「大概多少」的調整
/// - Note: `format` 同時會寫進輔助使用的數值說明，所以請回傳帶單位的文字
public struct LKSlider: View {

    // MARK: - Properties

    /// 把數字轉成看得懂的文字，例如加上幣別
    private let format: (Double) -> String

    /// 欄位下方的說明；不需要時是 nil
    private let help: String?

    /// 可調整的範圍
    private let range: ClosedRange<Double>

    /// 每一階跨多少
    private let step: Double

    /// 欄位上方的標籤
    private let title: String

    /// 是否為成功語氣，用於已完成的額度或用量
    private let usesSuccessTone: Bool

    /// 目前的值，由呼叫端持有
    @Binding private var value: Double

    // MARK: - Init

    /// 建立一個滑桿欄位
    ///
    /// - Parameters:
    ///   - title: 欄位上方的標籤
    ///   - value: 目前的值
    ///   - range: 可調整的範圍
    ///   - step: 每一階跨多少
    ///   - help: 欄位下方的說明
    ///   - usesSuccessTone: 是否為成功語氣
    ///   - format: 把數字轉成看得懂的文字，預設直接印出整數
    public init(
        _ title: String,
        value: Binding<Double>,
        in range: ClosedRange<Double>,
        step: Double = 1,
        help: String? = nil,
        usesSuccessTone: Bool = false,
        format: @escaping (Double) -> String = { String(Int($0)) }
    ) {
        self.title = title
        self._value = value
        self.range = range
        self.step = step
        self.help = help
        self.usesSuccessTone = usesSuccessTone
        self.format = format
    }

    // MARK: - Body

    /// 骨架：標籤、滑桿與目前數值、下方說明
    public var body: some View {
        VStack(alignment: .leading, spacing: LKSpacing.spacing4) {
            titleText

            HStack(spacing: LKSpacing.spacing12) {
                slider

                valueText
            }

            helpText
        }
    }
}

// MARK: - Private Views

private extension LKSlider {

    /// 欄位上方的標籤
    var titleText: some View {
        Text(title)
            .font(LKFont.subhead)
            .foregroundStyle(LKColor.textSecondary)
    }

    /// 滑桿本體，值與範圍都交給系統
    var slider: some View {
        Slider(value: $value, in: range, step: step)
            .tint(usesSuccessTone ? LKColor.success : LKColor.brand)
            .accessibilityLabel(title)
            .accessibilityValue(format(value))
    }

    /// 旁邊的目前數值。它與滑桿是同一個資訊，所以對閱讀器隱藏
    var valueText: some View {
        Text(format(value))
            .font(LKFont.bodyStrong)
            .foregroundStyle(LKColor.textPrimary)
            .monospacedDigit()
            .accessibilityHidden(true)
    }

    /// 欄位下方的說明，沒給時不佔位置
    @ViewBuilder
    var helpText: some View {
        if let help {
            Text(help)
                .font(LKFont.footnote)
                .foregroundStyle(LKColor.textSecondary)
        }
    }
}

// MARK: - Preview

#Preview("預算上限") {
    @Previewable @State var budget = 500.0

    LKSlider(
        "預算上限",
        value: $budget,
        in: 0...2000,
        step: 50,
        help: "只顯示低於這個金額的訂閱"
    ) { amount in
        "NT$ \(Int(amount))"
    }
    .padding(LKSpacing.spacing16)
}
