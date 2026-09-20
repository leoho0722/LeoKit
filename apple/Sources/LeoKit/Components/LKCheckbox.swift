//
//  LKCheckbox.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 從一組選項中多選，或同意一個條件
///
/// - Note: 要按「儲存」才生效的選項用這個；切換後立刻生效的用 `LKToggle`
/// - Note: 整列都是命中區，方框本身小於最小可點範圍，靠整列撐到 44pt
/// - Note: iOS 沒有原生 checkbox，所以方框是自繪的；邊框是它唯一的辨識依據，不可拿掉
public struct LKCheckbox: View {

    // MARK: - Properties

    /// 目前的勾選狀態，由呼叫端持有
    @Binding private var state: LKCheckboxState

    /// 標籤下方的一行說明；不需要時是 nil
    private let description: String?

    /// 選項的文字，可以換行
    private let label: String

    // MARK: - Init

    /// 建立一個可以有「部分勾選」的多選項
    ///
    /// - Parameters:
    ///   - label: 選項的文字
    ///   - state: 目前的勾選狀態
    ///   - description: 標籤下方的一行說明
    public init(_ label: String, state: Binding<LKCheckboxState>, description: String? = nil) {
        self.label = label
        self._state = state
        self.description = description
    }

    // MARK: - Body

    /// 整列的骨架：左邊方框、右邊標籤與說明，整列都可以點
    public var body: some View {
        Button {
            state = state.toggled
        } label: {
            HStack(alignment: .top, spacing: LKSpacing.spacing12) {
                box

                texts
            }
            .frame(minHeight: LKSize.controlHMd)
            .contentShape(.rect)
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(.isToggle)
        .accessibilityValue(state.accessibilityValue)
    }
}

// MARK: - Private Views

private extension LKCheckbox {

    /// 方框本身。往下推一點讓它對齊標籤的第一行，而不是整段文字的中線
    var box: some View {
        LKShape.xs
            .fill(state.isFilled ? LKColor.brand : LKColor.bgSurface)
            .frame(width: LKSize.choiceSize, height: LKSize.choiceSize)
            .overlay {
                mark
            }
            .overlay {
                LKShape.xs.stroke(borderColor, lineWidth: LKSize.hairline)
            }
            .padding(.top, Layout.boxTopInset)
    }

    /// 方框裡的勾或橫線，沒勾選時什麼都不畫
    @ViewBuilder
    var mark: some View {
        switch state {
        case .off:
            EmptyView()
        case .on:
            Image(systemName: "checkmark")
                .font(.system(size: Layout.markSize, weight: .bold))
                .foregroundStyle(LKColor.textOnBrand)
        case .mixed:
            Image(systemName: "minus")
                .font(.system(size: Layout.markSize, weight: .bold))
                .foregroundStyle(LKColor.textOnBrand)
        }
    }

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
}

// MARK: - Nested Types

extension LKCheckbox {

    /// 這個元件自己的版面數值，只放沒有對應 token 的尺寸
    ///
    /// - Note: 一律 computed 不用 stored —— `Layout` 巢狀在泛型型別裡時
    ///   static stored property 不合法，八個元件統一寫法才不用每次判斷
    private enum Layout {

        // MARK: - Computed Properties

        /// 方框往下推的距離，讓它對齊標籤的第一行
        static var boxTopInset: CGFloat { 2 }

        /// 方框裡勾號與橫線的大小
        static var markSize: CGFloat { 13 }
    }
}

// MARK: - Computed Properties

private extension LKCheckbox {

    /// 方框邊框的顏色；沒勾選時邊框是它唯一的辨識依據
    var borderColor: Color {
        if state.isFilled {
            LKColor.brand
        } else {
            LKColor.borderControl
        }
    }
}

// MARK: - Convenience

extension LKCheckbox {

    /// 建立一個只有勾與不勾的多選項
    ///
    /// - Parameters:
    ///   - label: 選項的文字
    ///   - isOn: 目前是否勾選
    ///   - description: 標籤下方的一行說明
    public init(_ label: String, isOn: Binding<Bool>, description: String? = nil) {
        self.init(
            label,
            state: Binding(
                get: { isOn.wrappedValue ? .on : .off },
                set: { isOn.wrappedValue = $0 == .on }
            ),
            description: description
        )
    }
}

// MARK: - Preview

#Preview("多選與部分選取") {
    @Previewable @State var all: LKCheckboxState = .mixed
    @Previewable @State var streaming = true
    @Previewable @State var devTools = false

    VStack(alignment: .leading, spacing: 0) {
        LKCheckbox("全部類別", state: $all, description: "目前選了 1 個，共 2 個")

        LKCheckbox("串流", isOn: $streaming)
            .padding(.leading, LKSpacing.spacing24)

        LKCheckbox("開發工具", isOn: $devTools)
            .padding(.leading, LKSpacing.spacing24)
    }
    .padding(LKSpacing.spacing16)
}
