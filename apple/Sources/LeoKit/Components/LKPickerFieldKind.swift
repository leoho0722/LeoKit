//
//  LKPickerFieldKind.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

/// 這個欄位會打開哪一種原生選擇器，決定它前面畫什麼圖示
public enum LKPickerFieldKind: CaseIterable, Sendable {

    /// 從一份清單裡選一個
    case options

    /// 選一個日期
    case date

    /// 選一個時間
    case time
}

// MARK: - Computed Properties

extension LKPickerFieldKind {

    /// 欄位最前面的圖示名稱，取自 SF Symbols；清單型不放圖示
    var systemImage: String? {
        switch self {
        case .options:
            nil
        case .date:
            "calendar"
        case .time:
            "clock"
        }
    }
}
