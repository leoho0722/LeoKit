//
//  LKTableRow.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import Foundation

/// 表格的一列：每一欄的鍵對到那一格要顯示的文字
public struct LKTableRow: Identifiable, Sendable {

    // MARK: - Properties

    /// 這一列的識別碼，用來讓 SwiftUI 認得是同一列
    public let id: UUID

    /// 鍵對應 `LKTableColumn` 的 `key`，值是那一格的文字
    public let cells: [String: String]

    // MARK: - Init

    /// 建立一列
    ///
    /// - Parameters:
    ///   - cells: 鍵對應欄位的 `key`，值是那一格的文字
    ///   - id: 這一列的識別碼；不指定時自動產生
    public init(cells: [String: String], id: UUID = UUID()) {
        self.cells = cells
        self.id = id
    }
}

// MARK: - Internal Method

extension LKTableRow {

    /// 取出某一欄在這一列的文字
    ///
    /// - Parameter column: 要取的欄
    /// - Returns: 那一格的文字；這一列沒有這一欄時是空字串
    func text(for column: LKTableColumn) -> String {
        cells[column.key] ?? ""
    }
}
