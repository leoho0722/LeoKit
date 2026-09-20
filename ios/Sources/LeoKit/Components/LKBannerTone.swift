//
//  LKBannerTone.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

/// 橫幅提示要傳達的意思，決定它的底色與文字顏色
///
/// - Note: 同時有多個狀況時只顯示最嚴重的那一個
public enum LKBannerTone: CaseIterable, Sendable {

    /// 單純說明一件事，沒有好壞
    case neutral

    /// 補充說明或使用提示
    case info

    /// 事情做完了、設定生效了
    case success

    /// 要留意的狀況，還可以繼續用
    case warning

    /// 出錯了，使用者得先處理才能繼續
    case danger
}
