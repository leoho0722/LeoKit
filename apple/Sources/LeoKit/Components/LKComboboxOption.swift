//
//  LKComboboxOption.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

/// 可搜尋清單裡的一個選項
public struct LKComboboxOption<Value: Hashable & Sendable>: Identifiable, Sendable {

    // MARK: - Properties

    /// 顯示給使用者看的文字，也是搜尋比對的對象
    public let label: String

    /// 這個選項代表的值
    public let value: Value

    // MARK: - Init

    /// 建立一個選項
    ///
    /// - Parameters:
    ///   - label: 顯示給使用者看的文字
    ///   - value: 這個選項代表的值
    public init(_ label: String, value: Value) {
        self.label = label
        self.value = value
    }
}

// MARK: - Computed Properties

extension LKComboboxOption {

    /// 用它代表的值當識別碼，所以同一份清單裡的值不能重複
    public var id: Value {
        value
    }
}
