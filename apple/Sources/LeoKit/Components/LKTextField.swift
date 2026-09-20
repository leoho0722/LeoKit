//
//  LKTextField.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

import SwiftUI

/// 一格文字輸入，含上方標籤與下方說明
///
/// - Note: 標籤永遠留在輸入框上方；不要拿 placeholder 當標籤，使用者一打字它就消失了
/// - Note: `error` 有值時會同時做三件事：邊框轉紅並加粗、顯示帶圖示的錯誤訊息、把錯誤內容接到朗讀的說明上
public struct LKTextField: View {

    // MARK: - Properties

    /// 使用者輸入的文字
    @Binding private var text: String

    /// 錯誤訊息，有值時整格轉為錯誤樣式；沒錯時是 nil
    private let error: String?

    /// 輸入框下方的說明，例如格式要求；`error` 有值時會被蓋掉
    private let help: String?

    /// 輸入框上方的標籤，不需要時是 nil
    private let label: String?

    /// 還沒輸入時框內的提示文字
    private let placeholder: String

    /// 輸入框最前面的圖示名稱，取自 SF Symbols；不放圖示時是 nil
    private let systemImage: String?

    // MARK: - Init

    /// 建立一格文字輸入
    ///
    /// - Parameters:
    ///   - label: 輸入框上方的標籤
    ///   - text: 使用者輸入的文字
    ///   - placeholder: 還沒輸入時框內的提示文字
    ///   - help: 輸入框下方的說明
    ///   - error: 錯誤訊息，有值時整格轉為錯誤樣式
    ///   - systemImage: 輸入框最前面的圖示名稱，取自 SF Symbols
    public init(
        _ label: String? = nil,
        text: Binding<String>,
        placeholder: String = "",
        help: String? = nil,
        error: String? = nil,
        systemImage: String? = nil
    ) {
        self.label = label
        self._text = text
        self.placeholder = placeholder
        self.help = help
        self.error = error
        self.systemImage = systemImage
    }

    // MARK: - Body

    /// 整格的骨架：由上而下是標籤、輸入框、說明或錯誤訊息
    public var body: some View {
        VStack(alignment: .leading, spacing: LKSpacing.spacing4) {
            labelText

            field

            footer
        }
        .accessibilityElement(children: .contain)
        .accessibilityValue(error ?? "")
    }
}

// MARK: - Private Views

private extension LKTextField {

    /// 輸入框上方的標籤，沒給時不佔位置
    @ViewBuilder
    var labelText: some View {
        if let label {
            Text(label)
                .font(LKFont.subhead)
                .foregroundStyle(LKColor.textSecondary)
        }
    }

    /// 輸入框本體，含最前面的圖示與外框
    var field: some View {
        HStack(spacing: LKSpacing.spacing8) {
            fieldIcon

            input
        }
        .padding(.horizontal, LKSpacing.spacing12)
        .frame(minHeight: LKSize.controlHMd)
        .background(LKColor.bgSurface, in: LKShape.md)
        .overlay {
            border
        }
    }

    /// 輸入框最前面的圖示，沒給名稱時不佔位置
    @ViewBuilder
    var fieldIcon: some View {
        if let systemImage {
            Image(systemName: systemImage)
                .font(.system(size: LKSize.iconMd))
                .foregroundStyle(LKColor.textTertiary)
        }
    }

    /// 真正接收鍵盤輸入的地方
    var input: some View {
        TextField(placeholder, text: $text)
            .font(LKFont.body)
            .foregroundStyle(LKColor.textPrimary)
            .textFieldStyle(.plain)
    }

    /// 輸入框的外框，有錯誤時轉紅並加粗
    var border: some View {
        LKShape.md
            .stroke(borderColor, lineWidth: borderWidth)
    }

    /// 輸入框下方的一行字：有錯誤就顯示錯誤，否則顯示說明
    @ViewBuilder
    var footer: some View {
        if let error {
            errorMessage(error)
        } else if let help {
            Text(help)
                .font(LKFont.footnote)
                .foregroundStyle(LKColor.textSecondary)
        }
    }
}

// MARK: - Computed Properties

private extension LKTextField {

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

// MARK: - Private Method

private extension LKTextField {

    /// 畫出帶警告圖示的錯誤訊息
    ///
    /// - Parameter message: 要顯示的錯誤訊息
    /// - Returns: 一行紅色的錯誤說明
    func errorMessage(_ message: String) -> some View {
        Label {
            Text(message)
                .font(LKFont.footnote)
        } icon: {
            Image(systemName: "exclamationmark.triangle")
        }
        .font(LKFont.footnote)
        .foregroundStyle(LKColor.dangerInk)
    }
}

// MARK: - Preview

#Preview("正常、說明與錯誤") {
    VStack(spacing: LKSpacing.spacing16) {
        LKTextField("名稱", text: .constant("LeoKit"), placeholder: "輸入名稱")

        LKTextField(
            "電子郵件",
            text: .constant("leo"),
            placeholder: "name@example.com",
            help: "登入與通知都會寄到這個地址",
            systemImage: "envelope"
        )

        LKTextField(
            "電子郵件",
            text: .constant("leo"),
            placeholder: "name@example.com",
            error: "這個地址看起來不完整",
            systemImage: "envelope"
        )
    }
    .padding(LKSpacing.spacing16)
    .background(LKColor.bgCanvas)
}
