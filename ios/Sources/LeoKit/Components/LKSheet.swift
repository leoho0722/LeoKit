//
//  LKSheet.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 由下往上推出的面板的內容
///
/// - Note: 這個型別只負責內容。要不要開、什麼時候關，交給系統的 `.sheet`，它同時提供下拉關閉與焦點處理
/// - Note: 它已經套好 `.presentationDetents` 與把手，呼叫端不必再設一次
/// - Note: 破壞性的選擇不要用面板，改用 `.confirmationDialog`
/// - Note: 標題會被朗讀成這個面板的名稱，所以即使視覺上不需要也建議給
public struct LKSheet<Content: View>: View {

    // MARK: - Properties

    /// 面板裡的動作或表單內容
    private let content: Content

    /// 標題下方的一行說明；不需要時是 nil
    private let subtitle: String?

    /// 面板的標題
    private let title: String

    // MARK: - Init

    /// 建立一個面板的內容
    ///
    /// - Parameters:
    ///   - title: 面板的標題
    ///   - subtitle: 標題下方的一行說明
    ///   - content: 面板裡的動作或表單內容
    public init(
        _ title: String,
        subtitle: String? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.title = title
        self.subtitle = subtitle
        self.content = content()
    }

    // MARK: - Body

    /// 面板的骨架：標題、說明，然後是內容
    public var body: some View {
        VStack(alignment: .leading, spacing: LKSpacing.spacing12) {
            titleText

            subtitleText

            content
        }
        .padding(.horizontal, LKSpacing.spacing20)
        .padding(.top, LKSpacing.spacing20)
        .padding(.bottom, LKSpacing.spacing24)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(LKColor.bgElevated)
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .accessibilityLabel(title)
    }
}

// MARK: - Private Views

private extension LKSheet {

    /// 面板的標題
    var titleText: some View {
        Text(title)
            .font(LKFont.title2)
            .foregroundStyle(LKColor.textPrimary)
    }

    /// 標題下方的說明，沒給時不佔位置
    @ViewBuilder
    var subtitleText: some View {
        if let subtitle {
            Text(subtitle)
                .font(LKFont.callout)
                .foregroundStyle(LKColor.textSecondary)
        }
    }
}

// MARK: - Preview

#Preview("排序方式") {
    @Previewable @State var isPresented = true

    Color.clear
        .sheet(isPresented: $isPresented) {
            LKSheet("排序方式", subtitle: "選了就立即套用") {
                VStack(spacing: LKSpacing.spacing8) {
                    Button("下次扣款日") { }
                        .buttonStyle(.lk(.secondary, fullWidth: true))

                    Button("金額高到低") { }
                        .buttonStyle(.lk(.secondary, fullWidth: true))
                }
            }
        }
}
