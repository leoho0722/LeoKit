//
//  LKPickerField.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 一個看起來像輸入框、按下去會打開原生選擇器的欄位
///
/// - Note: 這個元件只是「欄位」。它不持有值，也不自己彈出任何東西 ——
///   選擇面一律交給系統的 `Picker`、`DatePicker` 或 `LKCombobox`
/// - Note: 日期與時間一律用平台原生選擇器，時區、農曆、週起始日與語系格式系統都處理好了
/// - Note: `value` 傳已經格式化好的字串；格式化規則屬於呼叫端的業務邏輯
/// - Note: 選項只有兩三個且需要同時看見時，用 `LKRadio` 會比打開選擇面更快
public struct LKPickerField: View {

    // MARK: - Properties

    /// 按下欄位時要做的事，通常是打開原生選擇器
    private let action: () -> Void

    /// 錯誤訊息；有值時整格轉為錯誤樣式
    private let error: String?

    /// 欄位下方的說明；`error` 有值時會被蓋掉
    private let help: String?

    /// 這個欄位會打開哪一種原生選擇器
    private let kind: LKPickerFieldKind

    /// 還沒選時顯示的提示文字
    private let placeholder: String

    /// 欄位上方的標籤
    private let title: String

    /// 已經格式化好的顯示字串；還沒選時是 nil
    private let value: String?

    // MARK: - Init

    /// 建立一個會打開原生選擇器的欄位
    ///
    /// - Parameters:
    ///   - title: 欄位上方的標籤
    ///   - value: 已經格式化好的顯示字串
    ///   - placeholder: 還沒選時顯示的提示文字
    ///   - kind: 這個欄位會打開哪一種原生選擇器
    ///   - help: 欄位下方的說明
    ///   - error: 錯誤訊息
    ///   - action: 按下欄位時要做的事
    public init(
        _ title: String,
        value: String? = nil,
        placeholder: String = "請選擇",
        kind: LKPickerFieldKind = .options,
        help: String? = nil,
        error: String? = nil,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.value = value
        self.placeholder = placeholder
        self.kind = kind
        self.help = help
        self.error = error
        self.action = action
    }

    // MARK: - Body

    /// 骨架：標籤、可按的欄位、下方的說明或錯誤
    public var body: some View {
        VStack(alignment: .leading, spacing: LKSpacing.spacing4) {
            titleText

            field

            footer
        }
        .accessibilityElement(children: .contain)
    }
}

// MARK: - Private Views

private extension LKPickerField {

    /// 欄位上方的標籤
    ///
    /// - Note: 對 VoiceOver 隱藏 —— 它已經是欄位本身的名稱了，再唸一次是重複
    var titleText: some View {
        Text(title)
            .font(LKFont.subhead)
            .foregroundStyle(LKColor.textSecondary)
            .accessibilityHidden(true)
    }

    /// 可以按的欄位本體：圖示、目前的值、尾端的箭頭
    var field: some View {
        Button(action: action) {
            HStack(spacing: LKSpacing.spacing8) {
                leadingIcon

                Text(value ?? placeholder)
                    .font(LKFont.body)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foregroundStyle(value == nil ? LKColor.textTertiary : LKColor.textPrimary)

                Image(systemName: "chevron.down")
                    .font(.system(size: LKSize.iconSm, weight: .semibold))
                    .foregroundStyle(LKColor.textTertiary)
            }
            .padding(.horizontal, LKSpacing.spacing12)
            .frame(minHeight: LKSize.controlHMd)
            .background(LKColor.bgSurface, in: LKShape.md)
            .overlay {
                LKShape.md.stroke(borderColor, lineWidth: borderWidth)
            }
            .contentShape(.rect)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(title)
        .accessibilityValue(value ?? placeholder)
        .accessibilityHint(error ?? help ?? "")
    }

    /// 欄位最前面的圖示，清單型不畫
    @ViewBuilder
    var leadingIcon: some View {
        if let systemImage = kind.systemImage {
            Image(systemName: systemImage)
                .font(.system(size: LKSize.iconMd))
                .foregroundStyle(LKColor.textTertiary)
        }
    }

    /// 欄位下方的一行字：有錯誤就顯示錯誤，否則顯示說明
    @ViewBuilder
    var footer: some View {
        if let error {
            Label {
                Text(error)
                    .font(LKFont.footnote)
            } icon: {
                Image(systemName: "exclamationmark.triangle")
            }
            .font(LKFont.footnote)
            .foregroundStyle(LKColor.dangerInk)
        } else if let help {
            Text(help)
                .font(LKFont.footnote)
                .foregroundStyle(LKColor.textSecondary)
        }
    }
}

// MARK: - Computed Properties

private extension LKPickerField {

    /// 外框的顏色
    var borderColor: Color {
        if error == nil {
            LKColor.borderControl
        } else {
            LKColor.danger
        }
    }

    /// 外框的粗細，有錯誤時加粗
    var borderWidth: CGFloat {
        if error == nil {
            LKSize.hairline
        } else {
            LKSize.borderWStrong
        }
    }
}

// MARK: - Preview

#Preview("三種欄位") {
    VStack(spacing: LKSpacing.spacing16) {
        LKPickerField("扣款週期", value: "每月", help: "改成年繳通常會便宜一些") { }

        LKPickerField("下次扣款日", value: "2026/10/03", kind: .date) { }

        LKPickerField("提醒時間", kind: .time, error: "請選一個提醒時間") { }
    }
    .padding(LKSpacing.spacing16)
    .background(LKColor.bgCanvas)
}
