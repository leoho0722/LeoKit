//
//  LKMenu.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 從一個觸發點展開的動作清單
///
/// - Note: 這是系統 `Menu` 的薄包裝，只把觸發點畫成 LeoKit 的樣子；展開、定位與鍵盤行為都留給系統
/// - Note: 項目用系統的 `Button` 寫；破壞性項目給 `role: .destructive`，系統會自動染紅並排到最後
/// - Note: 行動端超過六項時不要用選單，改用 `LKSheet`
/// - Note: 只有圖示的觸發點一定要有標籤，例如「更多動作」
public struct LKMenu<Content: View>: View {

    // MARK: - Properties

    /// 選單裡的項目，用系統的 `Button` 撰寫
    private let content: Content

    /// 觸發點的文字；只想顯示圖示時是 nil
    private let label: String?

    /// 觸發點的圖示名稱，取自 SF Symbols
    private let systemImage: String

    /// 唸給螢幕閱讀器的說明，說明這個觸發點會展開什麼
    private let title: String

    // MARK: - Init

    /// 建立一個只有圖示的選單觸發點
    ///
    /// - Parameters:
    ///   - title: 說明這個觸發點會展開什麼，只給螢幕閱讀器聽
    ///   - systemImage: 觸發點的圖示名稱，取自 SF Symbols
    ///   - content: 選單裡的項目
    public init(
        _ title: String,
        systemImage: String = "ellipsis",
        @ViewBuilder content: () -> Content
    ) {
        self.title = title
        self.systemImage = systemImage
        self.label = nil
        self.content = content()
    }

    // MARK: - Body

    /// 選單本體，展開後的樣式與手感都交給系統
    public var body: some View {
        Menu {
            content
        } label: {
            trigger
        }
        .menuOrder(.fixed)
        .accessibilityLabel(title)
    }
}

// MARK: - Private Views

private extension LKMenu {

    /// 觸發點：有文字時是文字加圖示，沒文字時只有圖示
    @ViewBuilder
    var trigger: some View {
        if let label {
            HStack(spacing: LKSpacing.spacing4) {
                Text(label)
                    .font(LKFont.label)

                Image(systemName: systemImage)
                    .font(.system(size: LKSize.iconSm))
            }
            .padding(.horizontal, LKSpacing.spacing8)
            .frame(minHeight: LKSize.tapMinIos)
            .foregroundStyle(LKColor.brand)
            .contentShape(.rect)
        } else {
            Image(systemName: systemImage)
                .font(.system(size: LKSize.iconMd))
                .frame(width: LKSize.tapMinIos, height: LKSize.tapMinIos)
                .foregroundStyle(LKColor.brand)
                .contentShape(.rect)
        }
    }
}

// MARK: - Convenience

extension LKMenu {

    /// 建立一個帶文字的選單觸發點
    ///
    /// - Parameters:
    ///   - title: 觸發點的文字，同時給螢幕閱讀器聽
    ///   - systemImage: 文字後面的圖示名稱，取自 SF Symbols
    ///   - showsLabel: 是否顯示文字；傳 false 就等同只有圖示的版本
    ///   - content: 選單裡的項目
    public init(
        _ title: String,
        systemImage: String = "chevron.down",
        showsLabel: Bool,
        @ViewBuilder content: () -> Content
    ) {
        self.title = title
        self.systemImage = systemImage
        self.label = showsLabel ? title : nil
        self.content = content()
    }
}

// MARK: - Preview

#Preview("更多動作") {
    HStack(spacing: LKSpacing.spacing24) {
        LKMenu("更多動作") {
            Button("編輯訂閱", systemImage: "pencil") { }

            Button("暫停扣款", systemImage: "pause") { }

            Button("刪除訂閱", systemImage: "trash", role: .destructive) { }
        }

        LKMenu("排序方式", showsLabel: true) {
            Button("下次扣款日") { }

            Button("金額高到低") { }
        }
    }
    .padding(LKSpacing.spacing16)
}
