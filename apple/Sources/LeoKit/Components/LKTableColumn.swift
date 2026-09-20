//
//  LKTableColumn.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

/// 表格的一欄：它的標題、對應到哪個鍵，以及要不要靠右對齊
public struct LKTableColumn: Identifiable, Sendable {

    // MARK: - Properties

    /// 這一欄對應 `LKTableRow` 裡的哪個鍵
    public let key: String

    /// 欄位標題
    public let label: String

    /// 是否為數字欄；數字欄靠右並用等寬數字，方便上下比較位數
    public let isNumeric: Bool

    // MARK: - Init

    /// 建立一欄
    ///
    /// - Parameters:
    ///   - key: 這一欄對應 `LKTableRow` 裡的哪個鍵
    ///   - label: 欄位標題
    ///   - isNumeric: 是否為數字欄
    public init(key: String, label: String, isNumeric: Bool = false) {
        self.key = key
        self.label = label
        self.isNumeric = isNumeric
    }
}

// MARK: - Computed Properties

extension LKTableColumn {

    /// 用它對應的鍵當識別碼，所以同一張表裡的鍵不能重複
    public var id: String {
        key
    }
}
