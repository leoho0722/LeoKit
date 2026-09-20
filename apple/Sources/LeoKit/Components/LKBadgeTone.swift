//
//  LKBadgeTone.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

/// 標記要傳達的意思，決定它的底色與文字顏色
///
/// - Note: 顏色不能單獨承載意義，標記上的文字本身就要說清楚狀態
/// - Note: 紅綠色盲的人看不出 `success` 與 `danger` 的差別
public enum LKBadgeTone: CaseIterable, Sendable {

    /// 沒有好壞之分的標記：分類、標籤
    case neutral

    /// 跟品牌有關的標記：方案名稱、推薦項目
    case brand

    /// 已完成、成功、通過
    case success

    /// 要留意但還不算出錯
    case warning

    /// 失敗、過期、被拒絕
    case danger

    /// 未讀數量，用最醒目的紅底白字
    case count
}
