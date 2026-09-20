//
//  LKBanner.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

import SwiftUI

/// 留在版面上的提示，用來說明一個一直存在的狀況
///
/// - Note: 會自己消失的提示不能承載一定要被讀到的訊息，那是 Toast 的工作
/// - Note: 一個畫面最多一個橫幅，同時有多個狀況時只顯示最嚴重的那一個
/// - Note: 使用者自己解決不了的問題不要給 `onDismiss`，給了就等於允許他忽略它
public struct LKBanner<Actions: View>: View {

    // MARK: - Properties

    /// 橫幅下方的動作按鈕，不需要時傳 `EmptyView`
    private let actions: Actions

    /// 說明這個狀況的內容
    private let message: String

    /// 按下關閉時要做的事；傳 nil 表示這個提示不能被關掉
    private let onDismiss: (() -> Void)?

    /// 開頭的圖示名稱，取自 SF Symbols；不放圖示時是 nil
    private let systemImage: String?

    /// 一行標題，只有訊息很長時才需要
    private let title: String?

    /// 要傳達的意思，決定底色與文字顏色
    private let tone: LKBannerTone

    // MARK: - Init

    /// 建立一個留在版面上的提示
    ///
    /// - Parameters:
    ///   - message: 說明這個狀況的內容
    ///   - title: 一行標題
    ///   - tone: 要傳達的意思
    ///   - systemImage: 開頭的圖示名稱，取自 SF Symbols
    ///   - onDismiss: 按下關閉時要做的事
    ///   - actions: 橫幅下方的動作按鈕
    public init(
        _ message: String,
        title: String? = nil,
        tone: LKBannerTone = .neutral,
        systemImage: String? = nil,
        onDismiss: (() -> Void)? = nil,
        @ViewBuilder actions: () -> Actions
    ) {
        self.message = message
        self.title = title
        self.tone = tone
        self.systemImage = systemImage
        self.onDismiss = onDismiss
        self.actions = actions()
    }

    // MARK: - Body

    /// 橫幅的骨架：左邊圖示、中間文字與動作、右邊關閉鈕
    public var body: some View {
        HStack(alignment: .top, spacing: LKSpacing.spacing12) {
            icon

            content

            dismissButton
        }
        .padding(.horizontal, LKSpacing.spacing16)
        .padding(.vertical, LKSpacing.spacing12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .foregroundStyle(foreground)
        .background(background, in: LKShape.md)
        .accessibilityElement(children: .contain)
    }
}

// MARK: - Private Views

private extension LKBanner {

    /// 開頭的圖示，沒給名稱時不佔位置
    @ViewBuilder
    var icon: some View {
        if let systemImage {
            Image(systemName: systemImage)
                .font(.system(size: LKSize.iconMd))
        }
    }

    /// 中間的文字與動作按鈕，由上往下是標題、訊息、按鈕
    var content: some View {
        VStack(alignment: .leading, spacing: LKSpacing.spacing4) {
            titleText

            messageText

            actionButtons
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    /// 一行標題，沒給時不佔位置
    @ViewBuilder
    var titleText: some View {
        if let title {
            Text(title)
                .font(LKFont.headline)
        }
    }

    /// 說明這個狀況的內容
    var messageText: some View {
        Text(message)
            .font(LKFont.callout)
    }

    /// 橫幅下方的動作按鈕，一律用低調樣式，顏色跟著整個橫幅
    var actionButtons: some View {
        actions
            .padding(.top, LKSpacing.spacing4)
            .buttonStyle(.lk(.plain, size: .small))
    }

    /// 右上角的關閉鈕，不能關掉的提示不會顯示它
    @ViewBuilder
    var dismissButton: some View {
        if let onDismiss {
            Button {
                onDismiss()
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: LKSize.iconSm, weight: .semibold))
            }
            .buttonStyle(.plain)
            .accessibilityLabel("關閉提示")
        }
    }
}

// MARK: - Computed Properties

private extension LKBanner {

    /// 橫幅的底色
    var background: Color {
        switch tone {
        case .neutral:
            LKColor.bgSubtle
        case .info:
            LKColor.brandSubtle
        case .success:
            LKColor.successSubtle
        case .warning:
            LKColor.warningSubtle
        case .danger:
            LKColor.dangerSubtle
        }
    }

    /// 文字、圖示與裡面按鈕共用的顏色
    var foreground: Color {
        switch tone {
        case .neutral:
            LKColor.textPrimary
        case .info:
            LKColor.brandInk
        case .success:
            LKColor.successInk
        case .warning:
            LKColor.warningInk
        case .danger:
            LKColor.dangerInk
        }
    }
}

// MARK: - Convenience

extension LKBanner where Actions == EmptyView {

    /// 建立一個沒有動作按鈕的提示
    ///
    /// - Parameters:
    ///   - message: 說明這個狀況的內容
    ///   - title: 一行標題
    ///   - tone: 要傳達的意思
    ///   - systemImage: 開頭的圖示名稱，取自 SF Symbols
    ///   - onDismiss: 按下關閉時要做的事
    public init(
        _ message: String,
        title: String? = nil,
        tone: LKBannerTone = .neutral,
        systemImage: String? = nil,
        onDismiss: (() -> Void)? = nil
    ) {
        self.init(
            message,
            title: title,
            tone: tone,
            systemImage: systemImage,
            onDismiss: onDismiss
        ) {
            EmptyView()
        }
    }
}

// MARK: - Preview

#Preview("有標題與動作") {
    VStack(spacing: LKSpacing.spacing16) {
        LKBanner(
            "這個月的免費額度只剩三次。",
            title: "額度即將用完",
            tone: .warning,
            systemImage: "exclamationmark.triangle"
        ) {
            Button("查看方案") { }
        }

        LKBanner("備份已在昨天完成。", tone: .success, systemImage: "checkmark.circle")
    }
    .padding(LKSpacing.spacing16)
}
