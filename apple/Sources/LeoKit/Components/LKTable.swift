//
//  LKTable.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 多欄、可以上下比較的資料
///
/// - Note: 排序、分頁與篩選的邏輯都在呼叫端，這個元件只負責畫
/// - Note: 表格是寬版面的元件。iPhone 上請改用 `List` 搭配 `LKListRow`，一列一筆
/// - Note: 需要選取列、拖曳欄寬或跟著系統排序的資料表，用系統的 `Table` 會比這個合適
/// - Note: 數字欄靠右並用等寬數字，讓位數上下對齊
public struct LKTable: View {

    // MARK: - Properties

    /// 這張表在說什麼，唸給螢幕閱讀器聽
    private let caption: String

    /// 每一欄的定義，順序就是顯示順序
    private let columns: [LKTableColumn]

    /// 每一列的資料
    private let rows: [LKTableRow]

    // MARK: - Init

    /// 建立一張表
    ///
    /// - Parameters:
    ///   - caption: 這張表在說什麼
    ///   - columns: 每一欄的定義，順序就是顯示順序
    ///   - rows: 每一列的資料
    public init(_ caption: String, columns: [LKTableColumn], rows: [LKTableRow]) {
        self.caption = caption
        self.columns = columns
        self.rows = rows
    }

    // MARK: - Body

    /// 骨架：一列表頭，然後每一列資料，列與列之間畫分隔線
    public var body: some View {
        Grid(alignment: .leading, horizontalSpacing: LKSpacing.spacing12, verticalSpacing: 0) {
            header

            ForEach(rows) { row in
                divider

                dataRow(row)
            }
        }
        .padding(.horizontal, LKSpacing.spacing16)
        .background(LKColor.bgSurface)
        .accessibilityLabel(caption)
    }
}

// MARK: - Private Views

private extension LKTable {

    /// 表頭那一列
    var header: some View {
        GridRow {
            ForEach(columns) { column in
                Text(column.label)
                    .frame(maxWidth: .infinity, alignment: column.isNumeric ? .trailing : .leading)
                    .font(LKFont.subhead)
                    .foregroundStyle(LKColor.textSecondary)
                    .padding(.vertical, LKSpacing.spacing8)
            }
        }
    }

    /// 一列資料
    ///
    /// - Parameter row: 要畫的那一列
    /// - Returns: 一列的每一格
    func dataRow(_ row: LKTableRow) -> some View {
        GridRow {
            ForEach(columns) { column in
                cell(row.text(for: column), isNumeric: column.isNumeric)
            }
        }
    }

    /// 一格資料
    ///
    /// - Parameters:
    ///   - text: 這一格的文字
    ///   - isNumeric: 是否為數字欄
    /// - Returns: 一格
    @ViewBuilder
    func cell(_ text: String, isNumeric: Bool) -> some View {
        if isNumeric {
            Text(text)
                .frame(maxWidth: .infinity, alignment: .trailing)
                .padding(.vertical, LKSpacing.spacing12)
                .font(LKFont.callout)
                .foregroundStyle(LKColor.textPrimary)
                .monospacedDigit()
        } else {
            Text(text)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.vertical, LKSpacing.spacing12)
                .font(LKFont.callout)
                .foregroundStyle(LKColor.textPrimary)
        }
    }

    /// 列與列之間的分隔線，橫跨所有欄
    var divider: some View {
        Rectangle()
            .fill(LKColor.borderSubtle)
            .frame(height: LKSize.hairline)
            .gridCellColumns(columns.count)
    }
}

// MARK: - Preview

#Preview("本月訂閱") {
    LKTable(
        "本月訂閱與金額",
        columns: [
            LKTableColumn(key: "name", label: "服務"),
            LKTableColumn(key: "cycle", label: "週期"),
            LKTableColumn(key: "amount", label: "金額", isNumeric: true),
        ],
        rows: [
            LKTableRow(cells: ["name": "Netflix", "cycle": "月繳", "amount": "390"]),
            LKTableRow(cells: ["name": "Spotify", "cycle": "月繳", "amount": "149"]),
            LKTableRow(cells: ["name": "iCloud+", "cycle": "年繳", "amount": "1,090"]),
        ]
    )
    .padding(.vertical, LKSpacing.spacing16)
}
