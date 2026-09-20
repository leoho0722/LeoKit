//
//  LKSkeletonShape.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 佔位方塊的形狀，對應它要頂替的內容
public enum LKSkeletonShape: CaseIterable, Sendable {

    /// 一行內文
    case line

    /// 一行標題，比內文高一些
    case title

    /// 一個頭像
    case circle
}

// MARK: - Computed Properties

extension LKSkeletonShape {

    /// 這個形狀的高度
    var height: CGFloat {
        switch self {
        case .line:
            LKSpacing.spacing12
        case .title:
            LKSpacing.spacing20
        case .circle:
            LKSize.avatarMd
        }
    }

    /// 這個形狀的圓角
    var radius: CGFloat {
        switch self {
        case .line, .title:
            LKRadius.radiusXs
        case .circle:
            LKRadius.radiusPill
        }
    }
}
