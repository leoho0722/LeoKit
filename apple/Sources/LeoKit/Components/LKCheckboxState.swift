//
//  LKCheckboxState.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

/// 多選方框目前的三種狀態
///
/// - Note: [mixed] 用在「父項只勾了一部分子項」的情況，方框畫橫線而不是勾
/// - Note: 點一下 [mixed] 的父項一律變成全選，再點變成全不選，不會回到 [mixed]
public enum LKCheckboxState: CaseIterable, Sendable {

    /// 沒有勾選
    case off

    /// 已勾選
    case on

    /// 只勾了一部分，用於父項
    case mixed
}

// MARK: - Computed Properties

extension LKCheckboxState {

    /// 方框是否要填上品牌色，`off` 以外都要
    var isFilled: Bool {
        self != .off
    }

    /// 點一下之後的下一個狀態；`mixed` 會變成全選
    var toggled: LKCheckboxState {
        switch self {
        case .off, .mixed:
            .on
        case .on:
            .off
        }
    }

    /// 唸給螢幕閱讀器的狀態說明
    var accessibilityValue: String {
        switch self {
        case .off:
            "未勾選"
        case .on:
            "已勾選"
        case .mixed:
            "部分勾選"
        }
    }
}
