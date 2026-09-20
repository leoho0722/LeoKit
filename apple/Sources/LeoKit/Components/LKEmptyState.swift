//
//  LKEmptyState.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 一個區域目前沒有內容時該顯示什麼
///
/// - Note: 這是系統 `ContentUnavailableView` 的薄包裝，搜尋無結果請直接用它的 `.search` 變體
/// - Note: 標題用一句陳述加一個動作，不要只寫「沒有資料」
/// - Note: 空狀態不是錯誤。真的出錯請用 `LKBanner`，不要把錯誤畫成空狀態
/// - Note: 最多兩個動作，第一個是主要動作
public struct LKEmptyState<Actions: View>: View {

    // MARK: - Properties

    /// 標題下方的動作按鈕
    private let actions: Actions

    /// 說明接下來能做什麼；不需要時是 nil
    private let message: String?

    /// 開頭的圖示名稱，取自 SF Symbols
    private let systemImage: String

    /// 一句陳述，說明現在沒有什麼
    private let title: String

    // MARK: - Init

    /// 建立一個空狀態
    ///
    /// - Parameters:
    ///   - title: 一句陳述，說明現在沒有什麼
    ///   - systemImage: 開頭的圖示名稱，取自 SF Symbols
    ///   - message: 說明接下來能做什麼
    ///   - actions: 標題下方的動作按鈕
    public init(
        _ title: String,
        systemImage: String = "tray",
        message: String? = nil,
        @ViewBuilder actions: () -> Actions
    ) {
        self.title = title
        self.systemImage = systemImage
        self.message = message
        self.actions = actions()
    }

    // MARK: - Body

    /// 骨架：圖示、標題、說明，最後是動作
    public var body: some View {
        ContentUnavailableView {
            Label(title, systemImage: systemImage)
        } description: {
            messageText
        } actions: {
            actions
        }
        .tint(LKColor.brand)
    }
}

// MARK: - Private Views

private extension LKEmptyState {

    /// 標題下方的說明，沒給時不佔位置
    @ViewBuilder
    var messageText: some View {
        if let message {
            Text(message)
        }
    }
}

// MARK: - Convenience

extension LKEmptyState where Actions == EmptyView {

    /// 建立一個沒有動作的空狀態
    ///
    /// - Parameters:
    ///   - title: 一句陳述，說明現在沒有什麼
    ///   - systemImage: 開頭的圖示名稱，取自 SF Symbols
    ///   - message: 說明接下來能做什麼
    public init(_ title: String, systemImage: String = "tray", message: String? = nil) {
        self.init(title, systemImage: systemImage, message: message) {
            EmptyView()
        }
    }
}

// MARK: - Preview

#Preview("還沒有訂閱") {
    LKEmptyState(
        "還沒有任何訂閱。",
        systemImage: "tray",
        message: "新增第一筆之後，這裡會顯示每月總支出。"
    ) {
        Button("新增第一筆") { }
            .buttonStyle(.lk(.primary))
    }
}
