//
//  LKChip.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 一個可以點的短標籤：篩選、單選，或可移除的已選條件
///
/// - Note: 不能點的狀態標記請改用 `LKBadge`，這是兩者唯一的分界
/// - Note: iOS 沒有標準的 chip，所以這裡是自繪的膠囊按鈕，字級仍跟著系統設定放大
/// - Note: 選取時同時換底色與邊框色，不只靠底色深淺
/// - Note: 高度只有 32pt，低於最小可點範圍，所以命中區靠外距撐到 44pt
/// - Note: 標籤用名詞、六個中文字以內，放不下就改用多選列表而不是截斷
public struct LKChip: View {

    // MARK: - Properties

    /// 點下去要做的事；可移除的 Chip 這裡是「移除」
    private let action: () -> Void

    /// 目前是否被選取；可移除的 Chip 永遠是未選取樣式
    private let isSelected: Bool

    /// 尾端是否畫叉叉，表示點下去是移除而不是切換選取
    private let isRemovable: Bool

    /// 標籤的文字
    private let label: String

    /// 標籤前面的圖示名稱，取自 SF Symbols；不放圖示時是 nil
    private let systemImage: String?

    // MARK: - Init

    /// 建立一個可以切換選取的 Chip，用於篩選或單選
    ///
    /// - Parameters:
    ///   - label: 標籤的文字
    ///   - isSelected: 目前是否被選取
    ///   - systemImage: 標籤前面的圖示名稱，取自 SF Symbols
    ///   - action: 點下去要做的事，通常是把選取狀態反過來
    public init(
        _ label: String,
        isSelected: Bool = false,
        systemImage: String? = nil,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.isSelected = isSelected
        self.systemImage = systemImage
        self.isRemovable = false
        self.action = action
    }

    // MARK: - Body

    /// Chip 的骨架：圖示、文字、尾端叉叉，整個包在膠囊邊框裡
    public var body: some View {
        Button(action: action) {
            HStack(spacing: LKSpacing.spacing4) {
                leadingIcon

                labelText

                removeIcon
            }
            .padding(.horizontal, LKSpacing.spacing12)
            .frame(minHeight: LKSize.controlHSm)
            .foregroundStyle(foreground)
            .background(background, in: .capsule)
            .overlay {
                Capsule().stroke(borderColor, lineWidth: LKSize.hairline)
            }
            .padding(.vertical, Layout.hitAreaInset)
            .contentShape(.rect)
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(isSelected ? [.isButton, .isSelected] : .isButton)
    }
}

// MARK: - Private Views

private extension LKChip {

    /// 標籤前面的圖示，沒給名稱時不佔位置
    @ViewBuilder
    var leadingIcon: some View {
        if let systemImage {
            Image(systemName: systemImage)
                .font(.system(size: LKSize.iconSm))
        }
    }

    /// 標籤的文字
    var labelText: some View {
        Text(label)
            .font(LKFont.label)
    }

    /// 尾端的叉叉，只有可移除的 Chip 才畫
    @ViewBuilder
    var removeIcon: some View {
        if isRemovable {
            Image(systemName: "xmark")
                .font(.system(size: Layout.removeIconSize, weight: .semibold))
        }
    }
}

// MARK: - Nested Types

extension LKChip {

    /// 這個元件自己的版面數值，只放沒有對應 token 的尺寸
    private enum Layout {

        // MARK: - Properties

        /// 上下各加這麼多外距，把 32pt 高的膠囊撐到 44pt 的命中區
        static let hitAreaInset: CGFloat = 6

        /// 尾端叉叉的大小，比一般行內圖示再小一點
        static let removeIconSize: CGFloat = 11
    }
}

// MARK: - Computed Properties

private extension LKChip {

    /// 膠囊的底色
    var background: Color {
        if isSelected {
            LKColor.brandSubtle
        } else {
            LKColor.bgSurface
        }
    }

    /// 膠囊邊框的顏色，選取時換成品牌色
    var borderColor: Color {
        if isSelected {
            LKColor.brand
        } else {
            LKColor.borderControl
        }
    }

    /// 文字與圖示的顏色
    var foreground: Color {
        if isSelected {
            LKColor.brandInk
        } else {
            LKColor.textSecondary
        }
    }
}

// MARK: - Convenience

extension LKChip {

    /// 建立一個可以移除的 Chip，用於顯示已套用的條件
    ///
    /// - Parameters:
    ///   - label: 標籤的文字
    ///   - systemImage: 標籤前面的圖示名稱，取自 SF Symbols
    ///   - onRemove: 點下叉叉時要做的事
    public init(_ label: String, systemImage: String? = nil, onRemove: @escaping () -> Void) {
        self.label = label
        self.isSelected = false
        self.systemImage = systemImage
        self.isRemovable = true
        self.action = onRemove
    }
}

// MARK: - Preview

#Preview("篩選與已套用的條件") {
    @Previewable @State var picked: Set<String> = ["串流"]

    VStack(alignment: .leading, spacing: LKSpacing.spacing16) {
        HStack(spacing: LKSpacing.spacing8) {
            ForEach(["串流", "開發工具", "追星服務"], id: \.self) { name in
                LKChip(name, isSelected: picked.contains(name)) {
                    if picked.contains(name) {
                        picked.remove(name)
                    } else {
                        picked.insert(name)
                    }
                }
            }
        }

        HStack(spacing: LKSpacing.spacing8) {
            LKChip("月繳") { }

            LKChip("NT$ 300 以上", systemImage: "tag") { }
        }
    }
    .padding(LKSpacing.spacing16)
}
