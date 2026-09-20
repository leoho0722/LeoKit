//
//  LKStepper.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 用加減鈕微調一個小整數
///
/// - Note: 這是系統 `Stepper` 的薄包裝；長按連續調整是系統免費給的，自繪會失去它
/// - Note: 範圍大或使用者可能想直接輸入時，用 `LKTextField` 的數字鍵盤，不要讓人按二十次
/// - Note: 到邊界時系統會自動把那一側的按鈕停用，不需要自己判斷
public struct LKStepper: View {

    // MARK: - Properties

    /// 可調整的範圍
    private let range: ClosedRange<Int>

    /// 每按一次跨多少
    private let step: Int

    /// 說明在調整什麼，唸給螢幕閱讀器聽
    private let title: String

    /// 目前的值，由呼叫端持有
    @Binding private var value: Int

    // MARK: - Init

    /// 建立一個加減調整器
    ///
    /// - Parameters:
    ///   - title: 說明在調整什麼
    ///   - value: 目前的值
    ///   - range: 可調整的範圍
    ///   - step: 每按一次跨多少
    public init(
        _ title: String,
        value: Binding<Int>,
        in range: ClosedRange<Int>,
        step: Int = 1
    ) {
        self.title = title
        self._value = value
        self.range = range
        self.step = step
    }

    // MARK: - Body

    /// 調整器本體：目前數值加上系統的加減鈕
    public var body: some View {
        Stepper(value: $value, in: range, step: step) {
            valueText
        }
        .tint(LKColor.brand)
        .accessibilityLabel(title)
        .accessibilityValue(String(value))
    }
}

// MARK: - Private Views

private extension LKStepper {

    /// 目前的數值，用等寬數字避免按的時候左右跳動
    var valueText: some View {
        Text(String(value))
            .font(LKFont.bodyStrong)
            .foregroundStyle(LKColor.textPrimary)
            .monospacedDigit()
    }
}

// MARK: - Preview

#Preview("共享人數") {
    @Previewable @State var seats = 2

    LKStepper("共享人數", value: $seats, in: 1...6)
        .padding(LKSpacing.spacing16)
}
