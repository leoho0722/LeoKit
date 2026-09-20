//
//  LKAvatarSize.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 頭像的大小
public enum LKAvatarSize: CaseIterable, Sendable {

    /// 列表與疊加群組裡的小頭像
    case small

    /// 預設大小：列表列的前導、選單裡的使用者
    case medium

    /// 個人資料頁與卡片標頭
    case large
}

// MARK: - Computed Properties

extension LKAvatarSize {

    /// 這個大小的頭像邊長
    var length: CGFloat {
        switch self {
        case .small:
            LKSize.avatarSm
        case .medium:
            LKSize.avatarMd
        case .large:
            LKSize.avatarLg
        }
    }

    /// 首字要用哪一級字
    var font: Font {
        switch self {
        case .small:
            LKFont.labelSm
        case .medium:
            LKFont.label
        case .large:
            LKFont.title3
        }
    }
}
