//
//  LKToast.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 短暫的操作回饋
///
/// - Note: iOS 沒有 snackbar，所以這是自繪的；成功回饋請優先考慮就地更新畫面加觸覺回饋，這是次選
/// - Note: 它不搶焦點。顯示時機、排隊與自動消失由呼叫端管理，通常放在 `.overlay(alignment: .bottom)`
/// - Note: 成功不換色，狀態靠文字說明：反轉面上的狀態色對比不足，不要拿 success 當前景色
/// - Note: 帶動作時，那個動作必須也能從別處觸達：鍵盤使用者可能來不及碰到它
/// - Note: 錯誤要讓螢幕閱讀器立刻讀出來時，由呼叫端發 `AccessibilityNotification.Announcement`
public struct LKToast: View {

    // MARK: - Properties

    /// 動作的文字，例如「復原」；不需要時是 nil
    private let actionLabel: String?

    /// 是否為錯誤，會用更強的語氣播報
    private let isDanger: Bool

    /// 一句話說完的回饋內容
    private let message: String

    /// 按下動作時要做的事；不需要時是 nil
    private let onAction: (() -> Void)?

    /// 開頭的圖示名稱，取自 SF Symbols；不放圖示時是 nil
    private let systemImage: String?

    // MARK: - Init

    /// 建立一則短暫回饋
    ///
    /// - Parameters:
    ///   - message: 一句話說完的回饋內容
    ///   - systemImage: 開頭的圖示名稱，取自 SF Symbols
    ///   - isDanger: 是否為錯誤
    ///   - actionLabel: 動作的文字，例如「復原」
    ///   - onAction: 按下動作時要做的事
    public init(
        _ message: String,
        systemImage: String? = nil,
        isDanger: Bool = false,
        actionLabel: String? = nil,
        onAction: (() -> Void)? = nil
    ) {
        self.message = message
        self.systemImage = systemImage
        self.isDanger = isDanger
        self.actionLabel = actionLabel
        self.onAction = onAction
    }

    // MARK: - Body

    /// 骨架：圖示、訊息、尾端動作，整個包在反轉色的膠囊裡
    public var body: some View {
        HStack(spacing: LKSpacing.spacing12) {
            icon

            messageText

            actionButton
        }
        .padding(.horizontal, LKSpacing.spacing16)
        .padding(.vertical, LKSpacing.spacing12)
        .background(background, in: LKShape.md)
        .accessibilityElement(children: .combine)
    }
}

// MARK: - Private Views

private extension LKToast {

    /// 開頭的圖示，沒給名稱時不佔位置
    @ViewBuilder
    var icon: some View {
        if let systemImage {
            Image(systemName: systemImage)
                .font(.system(size: LKSize.iconMd))
                .foregroundStyle(foreground)
        }
    }

    /// 回饋的內容
    var messageText: some View {
        Text(message)
            .font(LKFont.callout)
            .foregroundStyle(foreground)
    }

    /// 尾端的動作，沒給時不佔位置
    @ViewBuilder
    var actionButton: some View {
        if let actionLabel, let onAction {
            Button(action: onAction) {
                Text(actionLabel)
                    .font(LKFont.label)
                    .foregroundStyle(actionForeground)
            }
            .buttonStyle(.plain)
        }
    }
}

// MARK: - Computed Properties

private extension LKToast {

    /// 膠囊的底色；錯誤用 danger，其餘用反轉面
    var background: Color {
        if isDanger {
            LKColor.danger
        } else {
            LKColor.bgInverse
        }
    }

    /// 訊息與圖示的顏色
    var foreground: Color {
        if isDanger {
            LKColor.textOnDanger
        } else {
            LKColor.textOnInverse
        }
    }

    /// 尾端動作的顏色；brand 在反轉面上對比不足，所以改用專用的 token
    var actionForeground: Color {
        if isDanger {
            LKColor.textOnDanger
        } else {
            LKColor.brandOnInverse
        }
    }
}

// MARK: - Preview

#Preview("回饋與錯誤") {
    VStack(spacing: LKSpacing.spacing12) {
        LKToast("已刪除 Netflix 訂閱。", actionLabel: "復原") { }

        LKToast("同步失敗，稍後會自動重試。", systemImage: "exclamationmark.triangle", isDanger: true)
    }
    .padding(LKSpacing.spacing16)
    .background(LKColor.bgCanvas)
}
