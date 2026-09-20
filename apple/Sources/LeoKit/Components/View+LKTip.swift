//
//  View+LKTip.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI
import TipKit

// MARK: - LKTip

extension View {

    /// 把 LeoKit 的外觀套到 TipKit 畫出來的提示上
    ///
    /// 「什麼時候出現、最多出現幾次、看過了沒有」全部交給 TipKit 的 `Tip` 與 `Rule`，
    /// 不要自己做狀態機。`Tip` 的 `id` 請與 Android 和 Web 用同一個字串，
    /// 這樣「哪些提示、什麼時候出現」可以寫成一份跨平台的清單。
    ///
    /// - Returns: 套好提示外觀的畫面
    /// - Note: 把它套在包含 `TipView` 的那一層上，底下所有提示都會跟著套用
    /// - Note: 提示不搶焦點，它是補充資訊，不是需要處理的事情
    /// - Note: 關閉鈕的文字由 TipKit 提供；被指的元素要有自己的輔助使用標籤，不要靠提示說明它
    public func lkTipAppearance() -> some View {
        tipBackground(LKColor.brandSubtle)
            .tipCornerRadius(LKRadius.radiusMd)
    }
}
