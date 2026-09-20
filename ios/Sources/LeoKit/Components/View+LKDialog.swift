//
//  View+LKDialog.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

// MARK: - LKDialog

extension View {

    /// 打斷使用者、要求一個決定的對話框
    ///
    /// iOS 的對話框由系統畫，焦點鎖、Esc 與按鈕排列都由它處理，所以這裡不自繪一個出來，
    /// 只把設計系統的約定編進參數：一定要有取消、破壞性動作要標成 `destructive`，
    /// 而且預設焦點永遠不落在破壞性按鈕上。
    ///
    /// - Parameters:
    ///   - title: 用問句或結果句，會被朗讀成這個對話框的名稱
    ///   - isPresented: 對話框是否顯示，由呼叫端持有
    ///   - message: 說明後果，不要重複標題
    ///   - confirmLabel: 確認按鈕的文字，寫動詞加受詞，例如「刪除訂閱」
    ///   - isDestructive: 這個動作是否收不回來；true 時系統會把按鈕染紅
    ///   - cancelLabel: 取消按鈕的文字
    ///   - onConfirm: 使用者按下確認時要做的事
    /// - Returns: 掛上對話框的畫面
    /// - Note: 只有一個選項的告知用 `.alert`；超過兩個選項用 `.confirmationDialog`
    /// - Note: 不要拿對話框問可以就地處理的事，也不要用它顯示載入中
    public func lkConfirmation(
        _ title: String,
        isPresented: Binding<Bool>,
        message: String? = nil,
        confirmLabel: String,
        isDestructive: Bool = false,
        cancelLabel: String = "取消",
        onConfirm: @escaping () -> Void
    ) -> some View {
        alert(title, isPresented: isPresented) {
            Button(cancelLabel, role: .cancel) { }

            Button(confirmLabel, role: isDestructive ? .destructive : nil, action: onConfirm)
        } message: {
            if let message {
                Text(message)
            }
        }
    }
}
