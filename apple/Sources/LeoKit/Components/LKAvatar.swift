//
//  LKAvatar.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 代表一個人或一個服務的小圖
///
/// - Note: 退階順序是圖片、首字、人形字形；圖片載入失敗時系統會自動退到下一階
/// - Note: 圓形代表人、方形代表服務或品牌，這個形狀差異是語意不是裝飾
/// - Note: 不要用名字去 hash 出隨機底色，那會產生大量沒驗證過對比的組合
/// - Note: 旁邊已經有名字文字時把 `isDecorative` 設為 true，避免閱讀器把名字念兩次
public struct LKAvatar: View {

    // MARK: - Properties

    /// 旁邊已經有名字文字時設為 true，對螢幕閱讀器隱藏
    private let isDecorative: Bool

    /// 是否用方形，代表服務或品牌
    private let isSquare: Bool

    /// 完整名稱。沒有圖片時取首字，同時當作輔助使用標籤
    private let name: String?

    /// 頭像的大小
    private let size: LKAvatarSize

    /// 圖片來源；沒有圖片時是 nil
    private let source: URL?

    /// 是否用品牌色底，用於服務或方案
    private let usesBrandTone: Bool

    // MARK: - Init

    /// 建立一個頭像
    ///
    /// - Parameters:
    ///   - name: 完整名稱
    ///   - source: 圖片來源
    ///   - size: 頭像的大小
    ///   - isSquare: 是否用方形，代表服務或品牌
    ///   - usesBrandTone: 是否用品牌色底
    ///   - isDecorative: 旁邊已經有名字文字時設為 true
    public init(
        name: String? = nil,
        source: URL? = nil,
        size: LKAvatarSize = .medium,
        isSquare: Bool = false,
        usesBrandTone: Bool = false,
        isDecorative: Bool = false
    ) {
        self.name = name
        self.source = source
        self.size = size
        self.isSquare = isSquare
        self.usesBrandTone = usesBrandTone
        self.isDecorative = isDecorative
    }

    // MARK: - Body

    /// 頭像本體：有圖片就顯示圖片，否則顯示首字或人形字形
    public var body: some View {
        content
            .frame(width: size.length, height: size.length)
            .background(background)
            .foregroundStyle(foreground)
            .clipShape(shape)
            .accessibilityLabel(name ?? "")
            .accessibilityHidden(isDecorative || name == nil)
    }
}

// MARK: - Private Views

private extension LKAvatar {

    /// 依退階順序決定裡面畫什麼
    @ViewBuilder
    var content: some View {
        if let source {
            AsyncImage(url: source) { image in
                image
                    .resizable()
                    .scaledToFill()
            } placeholder: {
                fallback
            }
        } else {
            fallback
        }
    }

    /// 沒有圖片時的內容：有名字就取首字，沒有就用人形字形
    @ViewBuilder
    var fallback: some View {
        if let name, !initials(of: name).isEmpty {
            Text(initials(of: name))
                .font(size.font)
        } else {
            Image(systemName: "person.fill")
                .font(.system(size: size.length * Layout.glyphRatio))
        }
    }
}

// MARK: - Nested Types

extension LKAvatar {

    /// 這個元件自己的版面數值，只放沒有對應 token 的尺寸
    ///
    /// - Note: 一律 computed 不用 stored —— `Layout` 巢狀在泛型型別裡時
    ///   static stored property 不合法，八個元件統一寫法才不用每次判斷
    private enum Layout {

        // MARK: - Computed Properties

        /// 人形字形相對於整個頭像的比例
        static var glyphRatio: CGFloat { 0.5 }

        /// 方形頭像的圓角
        static var squareRadius: CGFloat { 6 }
    }
}

// MARK: - Computed Properties

private extension LKAvatar {

    /// 頭像的底色
    var background: Color {
        if usesBrandTone {
            LKColor.brandSubtle
        } else {
            LKColor.bgSubtle
        }
    }

    /// 首字與字形的顏色
    var foreground: Color {
        if usesBrandTone {
            LKColor.brandInk
        } else {
            LKColor.textSecondary
        }
    }

    /// 頭像的形狀：人是圓形，服務是小圓角的方形
    var shape: AnyShape {
        if isSquare {
            AnyShape(RoundedRectangle(cornerRadius: Layout.squareRadius, style: .continuous))
        } else {
            AnyShape(Circle())
        }
    }
}

// MARK: - Private Method

private extension LKAvatar {

    /// 從完整名稱取出要顯示的首字
    ///
    /// - Parameter name: 完整名稱
    /// - Returns: 中日韓取第一個字，拉丁字母取前兩個詞的首字母大寫
    func initials(of name: String) -> String {
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard let first = trimmed.first else {
            return ""
        }
        if first.isLetter, !first.isASCII {
            return String(first)
        }
        return trimmed
            .split(separator: " ")
            .prefix(2)
            .compactMap { $0.first }
            .map { String($0).uppercased() }
            .joined()
    }
}

// MARK: - Preview

#Preview("三種退階與兩種形狀") {
    HStack(spacing: LKSpacing.spacing16) {
        LKAvatar(name: "林怡君", size: .small)

        LKAvatar(name: "Leo Ho")

        LKAvatar(name: "林怡君", size: .large)

        LKAvatar()

        LKAvatar(name: "Netflix", isSquare: true, usesBrandTone: true)
    }
    .padding(LKSpacing.spacing16)
}
