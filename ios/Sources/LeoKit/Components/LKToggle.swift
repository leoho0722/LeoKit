//
//  LKToggle.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 開關一個切換後立刻生效的設定
///
/// - Note: 這是系統 `Toggle` 的薄包裝，只把品牌色套上去，按下的手感與輔助使用行為都留給系統
/// - Note: 標籤寫「開啟後會發生什麼」的肯定句；否定句配開關會讓人分不清方向
/// - Note: 需要按「儲存」才生效的選項用 `LKCheckbox`，不要用這個
/// - Note: 放進 `LKListRow` 的尾端時用沒有標籤的那個 init，說明文字交給列本身
public struct LKToggle: View {

    // MARK: - Properties

    /// 目前是否開啟，由呼叫端持有
    @Binding private var isOn: Bool

    /// 只有開關沒有文字時，唸給螢幕閱讀器的說明
    private let accessibilityLabel: String?

    /// 開關旁邊的文字；放進列表尾端時是 nil
    private let label: String?

    // MARK: - Init

    /// 建立一個帶文字的開關
    ///
    /// - Parameters:
    ///   - label: 開關旁邊的文字，寫「開啟後會發生什麼」
    ///   - isOn: 目前是否開啟
    public init(_ label: String, isOn: Binding<Bool>) {
        self.label = label
        self._isOn = isOn
        self.accessibilityLabel = nil
    }

    // MARK: - Body

    /// 開關本體。有文字時文字靠左、開關靠右；沒有文字時只有開關
    public var body: some View {
        if let label {
            labeled(label)
        } else {
            bare
        }
    }
}

// MARK: - Private Views

private extension LKToggle {

    /// 只有開關、沒有文字的版本，說明交給輔助使用標籤
    var bare: some View {
        Toggle("", isOn: $isOn)
            .labelsHidden()
            .tint(LKColor.brand)
            .accessibilityLabel(accessibilityLabel ?? "")
    }

    /// 文字靠左、開關靠右的版本
    ///
    /// - Parameter label: 開關旁邊的文字
    /// - Returns: 帶文字的系統開關
    func labeled(_ label: String) -> some View {
        Toggle(isOn: $isOn) {
            Text(label)
                .font(LKFont.body)
                .foregroundStyle(LKColor.textPrimary)
        }
        .tint(LKColor.brand)
    }
}

// MARK: - Convenience

extension LKToggle {

    /// 建立一個只有開關、沒有文字的版本，用於 `LKListRow` 的尾端
    ///
    /// - Parameters:
    ///   - isOn: 目前是否開啟
    ///   - accessibilityLabel: 唸給螢幕閱讀器的說明，這裡必填
    public init(isOn: Binding<Bool>, accessibilityLabel: String) {
        self.label = nil
        self._isOn = isOn
        self.accessibilityLabel = accessibilityLabel
    }
}

// MARK: - Preview

#Preview("設定列表") {
    @Previewable @State var reminder = true
    @Previewable @State var digest = false

    VStack(spacing: LKSpacing.spacing16) {
        LKToggle("扣款前三天提醒", isOn: $reminder)

        LKToggle("每週寄送支出摘要", isOn: $digest)

        LKListRow("深色模式", systemImage: "moon") {
            LKToggle(isOn: $digest, accessibilityLabel: "深色模式")
        }
    }
    .padding(LKSpacing.spacing16)
}
