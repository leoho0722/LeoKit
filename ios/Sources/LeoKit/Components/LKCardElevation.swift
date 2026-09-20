//
//  LKCardElevation.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

/// 卡片看起來浮起多高
///
/// - Note: 深色主題不用陰影表達高低，改用比背景亮一階的底色，所以深色下一律當成 `flat`
public enum LKCardElevation: CaseIterable, Sendable {

    /// 貼平在背景上，不畫陰影
    case flat

    /// 預設：貼著背景但有一點陰影
    case resting

    /// 明顯浮在其他內容之上，用於被拉出來強調的卡片
    case raised
}
