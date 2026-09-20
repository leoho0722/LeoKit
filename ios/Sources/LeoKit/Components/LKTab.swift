//
//  LKTab.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

/// 一個 tab 的內容：它的文字、它代表的值，以及要不要帶圖示或數量標記
public struct LKTab<Value: Hashable & Sendable>: Identifiable, Sendable {

    // MARK: - Properties

    /// 數量標記的文字，例如未讀筆數；不需要時是 nil
    public let badge: String?

    /// tab 上的文字，用名詞
    public let label: String

    /// 文字前面的圖示名稱，取自 SF Symbols；不放圖示時是 nil
    public let systemImage: String?

    /// 這個 tab 代表的值，被選到時會寫回呼叫端的 selection
    public let value: Value

    // MARK: - Init

    /// 建立一個 tab
    ///
    /// - Parameters:
    ///   - label: tab 上的文字
    ///   - value: 這個 tab 代表的值
    ///   - systemImage: 文字前面的圖示名稱，取自 SF Symbols
    ///   - badge: 數量標記的文字
    public init(
        _ label: String,
        value: Value,
        systemImage: String? = nil,
        badge: String? = nil
    ) {
        self.label = label
        self.value = value
        self.systemImage = systemImage
        self.badge = badge
    }
}

// MARK: - Computed Properties

extension LKTab {

    /// 用它代表的值當識別碼，所以同一排裡的值不能重複
    public var id: Value {
        value
    }
}
