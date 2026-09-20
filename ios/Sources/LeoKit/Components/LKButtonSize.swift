//
//  LKButtonSize.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

import SwiftUI

/// 按鈕的大小
///
/// - Note: `medium` 高 44pt，剛好是 Apple 要求的最小可點範圍
public enum LKButtonSize: CaseIterable, Sendable {

    /// 擠在一起的版面裡的次要按鈕；不到 44pt，要靠周圍留白把可點範圍補足
    case small

    /// 預設大小，高 44pt
    case medium

    /// 主要行動按鈕、整列寬的按鈕、表單的送出
    case large
}

// MARK: - Computed Properties

extension LKButtonSize {

    /// 這個大小的按鈕有多高
    var height: CGFloat {
        switch self {
        case .small:
            LKSize.controlHSm
        case .medium:
            LKSize.controlHMd
        case .large:
            LKSize.controlHLg
        }
    }

    /// 這個大小的按鈕文字要用哪一級字
    var font: Font {
        switch self {
        case .small:
            LKFont.labelSm
        case .medium:
            LKFont.label
        case .large:
            LKFont.labelLg
        }
    }
}
