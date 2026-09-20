//
//  LKButtonVariant.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

/// 按鈕在畫面上的重要程度
///
/// - Note: 一個畫面最多一個 `primary`，也最多一個 `destructive`
public enum LKButtonVariant: CaseIterable, Sendable {

    /// 使用者接下來該做的那件事
    case primary

    /// 跟主要動作一樣重要的另一個選擇
    case secondary

    /// 有份量但不是主角：匯入、分享
    case tonal

    /// 低調的動作：工具列、卡片角落
    case plain

    /// 刪除、解除連結這類收不回來的動作，一定要再問一次才執行
    case destructive
}
