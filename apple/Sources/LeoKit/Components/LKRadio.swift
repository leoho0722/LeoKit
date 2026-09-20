//
//  LKRadio.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 從一組互斥的選項中選一個，且所有選項都要同時看得見
///
/// - Note: iOS 的原生做法是在列的右側打勾，不是畫圓圈，所以這裡刻意不畫圓圈
/// - Note: 每個選項可以帶一行說明，這是它比 `LKPickerField` 好用的主要理由
/// - Note: 選了就不能取消，只能換選別的；進畫面時 `selection` 就要有值
/// - Note: 不需要每個選項都帶說明時，改用系統的 `Picker` 搭配 `.pickerStyle(.inline)`
public struct LKRadio<Value: Hashable>: View {

    // MARK: - Properties

    /// 目前整組選到哪一個，由呼叫端持有
    @Binding private var selection: Value

    /// 標籤下方的一行說明；不需要時是 nil
    private let description: String?

    /// 選項的文字
    private let label: String

    /// 這個選項代表的值，被選到時會寫回 `selection`
    private let value: Value

    // MARK: - Init

    /// 建立一組互斥選項中的一個
    ///
    /// - Parameters:
    ///   - label: 選項的文字
    ///   - value: 這個選項代表的值
    ///   - selection: 目前整組選到哪一個
    ///   - description: 標籤下方的一行說明
    public init(
        _ label: String,
        value: Value,
        selection: Binding<Value>,
        description: String? = nil
    ) {
        self.label = label
        self.value = value
        self._selection = selection
        self.description = description
    }

    // MARK: - Body

    /// 一列的骨架：左邊標籤與說明，右邊在被選到時打一個勾
    public var body: some View {
        Button {
            selection = value
        } label: {
            HStack(alignment: .top, spacing: LKSpacing.spacing12) {
                texts

                checkmark
            }
            .frame(minHeight: LKSize.controlHMd)
            .contentShape(.rect)
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(isSelected ? [.isButton, .isSelected] : .isButton)
    }
}

// MARK: - Private Views

private extension LKRadio {

    /// 標籤與它下方的說明
    var texts: some View {
        VStack(alignment: .leading, spacing: LKSpacing.spacing2) {
            Text(label)
                .font(LKFont.body)
                .foregroundStyle(LKColor.textPrimary)

            descriptionText
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    /// 標籤下方的說明，沒給時不佔位置
    @ViewBuilder
    var descriptionText: some View {
        if let description {
            Text(description)
                .font(LKFont.footnote)
                .foregroundStyle(LKColor.textSecondary)
        }
    }

    /// 被選到時右側的勾，沒選到時留空但仍佔位置，避免整列文字左右跳動
    var checkmark: some View {
        Image(systemName: "checkmark")
            .font(.system(size: LKSize.iconSm, weight: .semibold))
            .foregroundStyle(LKColor.brand)
            .opacity(isSelected ? 1 : 0)
            .padding(.top, Layout.checkmarkTopInset)
    }
}

// MARK: - Nested Types

extension LKRadio {

    /// 這個元件自己的版面數值，只放沒有對應 token 的尺寸
    private enum Layout {

        // MARK: - Properties

        /// 勾號往下推的距離，讓它對齊標籤的第一行
        static let checkmarkTopInset: CGFloat = 2
    }
}

// MARK: - Computed Properties

private extension LKRadio {

    /// 這個選項目前是否被選到
    var isSelected: Bool {
        selection == value
    }
}

// MARK: - Preview

#Preview("付款週期") {
    @Previewable @State var cycle = "monthly"

    VStack(alignment: .leading, spacing: 0) {
        LKRadio("月繳", value: "monthly", selection: $cycle, description: "每月 NT$ 390")

        LKRadio("季繳", value: "quarterly", selection: $cycle, description: "每月約 NT$ 360")

        LKRadio("年繳", value: "yearly", selection: $cycle, description: "每月約 NT$ 325，省下 NT$ 780")
    }
    .padding(LKSpacing.spacing16)
}
