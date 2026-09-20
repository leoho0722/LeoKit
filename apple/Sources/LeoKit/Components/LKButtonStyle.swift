//
//  LKButtonStyle.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

import SwiftUI

/// LeoKit 的按鈕外觀，直接套在 SwiftUI 的 `Button` 上
///
/// - Note: 套上去之後按下的回饋與輔助使用的行為都還是系統原本那一套
/// - Note: 用 `.buttonStyle(.lk(.primary))` 取用，不必自己建這個型別
/// - Note: 按鈕上的字用動詞開頭的短句；會刪掉東西的按鈕要把後果寫在字面上
public struct LKButtonStyle {

    // MARK: - Properties

    /// 按鈕目前是否可以按，停用時整顆變淡
    @Environment(\.isEnabled) private var isEnabled

    /// 按鈕是否撐滿一整列
    private let fullWidth: Bool

    /// 按鈕的大小
    private let size: LKButtonSize

    /// 按鈕在畫面上的重要程度
    private let variant: LKButtonVariant

    // MARK: - Init

    /// 建立一組按鈕外觀
    ///
    /// - Parameters:
    ///   - variant: 按鈕在畫面上的重要程度
    ///   - size: 按鈕的大小
    ///   - fullWidth: 按鈕是否撐滿一整列
    public init(
        _ variant: LKButtonVariant = .primary,
        size: LKButtonSize = .medium,
        fullWidth: Bool = false
    ) {
        self.variant = variant
        self.size = size
        self.fullWidth = fullWidth
    }
}

// MARK: - Computed Properties

private extension LKButtonStyle {

    /// 按鈕的形狀，小尺寸用小一級的圓角
    var shape: AnyShape {
        switch size {
        case .small:
            AnyShape(LKShape.sm)
        case .medium, .large:
            AnyShape(LKShape.md)
        }
    }

    /// 按鈕的最大寬度，要撐滿一整列時就不限制
    var maxWidth: CGFloat? {
        if fullWidth {
            .infinity
        } else {
            nil
        }
    }

    /// 文字左右的內距；低調按鈕不需要撐開，所以最窄
    var horizontalPadding: CGFloat {
        if variant == .plain {
            LKSpacing.spacing8
        } else {
            switch size {
            case .small:
                LKSpacing.spacing12
            case .medium:
                LKSpacing.spacing16
            case .large:
                LKSpacing.spacing20
            }
        }
    }

    /// 按鈕的底色
    var background: Color {
        switch variant {
        case .primary:
            LKColor.brand
        case .secondary:
            LKColor.bgSurface
        case .tonal:
            LKColor.brandSubtle
        case .plain:
            Color.clear
        case .destructive:
            LKColor.danger
        }
    }

    /// 按鈕文字與圖示的顏色
    var foreground: Color {
        switch variant {
        case .primary:
            LKColor.textOnBrand
        case .secondary:
            LKColor.textPrimary
        case .tonal:
            LKColor.brandInk
        case .plain:
            LKColor.brand
        case .destructive:
            LKColor.textOnDanger
        }
    }

    /// 次要按鈕的外框；其他樣式靠底色就分得出來，所以不畫
    @ViewBuilder
    var border: some View {
        if variant == .secondary {
            shape
                .stroke(LKColor.borderStrong, lineWidth: LKSize.hairline)
        }
    }
}

// MARK: - ButtonStyle

extension LKButtonStyle: ButtonStyle {

    /// 把按鈕原本的文字包上 LeoKit 的底色、圓角與按下回饋
    ///
    /// - Parameter configuration: 系統給的按鈕內容與目前是否被按住
    /// - Returns: 套好外觀的按鈕
    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.horizontal, horizontalPadding)
            .frame(maxWidth: maxWidth, minHeight: size.height)
            .font(size.font)
            .foregroundStyle(foreground)
            .background(background, in: shape)
            .overlay {
                border
            }
            .opacity(opacity(isPressed: configuration.isPressed))
            .contentShape(.rect)
    }
}

// MARK: - Private Method

private extension LKButtonStyle {

    /// 算出整顆按鈕的不透明度：按住時變淡當作回饋，停用時更淡
    ///
    /// - Parameter isPressed: 使用者目前是否按住這顆按鈕
    /// - Returns: 要套在整顆按鈕上的不透明度
    func opacity(isPressed: Bool) -> Double {
        if isPressed {
            LKOpacity.opacityPressed
        } else if isEnabled {
            1
        } else {
            LKOpacity.opacityDisabled
        }
    }
}

// MARK: - Convenience

extension ButtonStyle where Self == LKButtonStyle {

    /// 讓呼叫端能寫 `.buttonStyle(.lk(.primary))` 的便利存取子
    ///
    /// - Parameters:
    ///   - variant: 按鈕在畫面上的重要程度
    ///   - size: 按鈕的大小
    ///   - fullWidth: 按鈕是否撐滿一整列
    /// - Returns: 對應設定的 LeoKit 按鈕外觀
    public static func lk(
        _ variant: LKButtonVariant = .primary,
        size: LKButtonSize = .medium,
        fullWidth: Bool = false
    ) -> LKButtonStyle {
        LKButtonStyle(variant, size: size, fullWidth: fullWidth)
    }
}

// MARK: - Preview

#Preview("五種重要程度") {
    VStack(spacing: LKSpacing.spacing12) {
        Button("儲存變更") { }
            .buttonStyle(.lk(.primary))

        Button("稍後再說") { }
            .buttonStyle(.lk(.secondary))

        Button("匯入資料") { }
            .buttonStyle(.lk(.tonal))

        Button("查看說明") { }
            .buttonStyle(.lk(.plain, size: .small))

        Button("刪除這個專案") { }
            .buttonStyle(.lk(.destructive, fullWidth: true))

        Button("已停用") { }
            .buttonStyle(.lk(.primary))
            .disabled(true)
    }
    .padding(LKSpacing.spacing16)
}
