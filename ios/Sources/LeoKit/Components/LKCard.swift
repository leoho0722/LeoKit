//
//  LKCard.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

import SwiftUI

/// 把一組相關的內容收成一個看得出邊界的面
///
/// - Note: 卡片裡不要再放卡片，層層疊起來會讓人看不出哪一塊是重點
public struct LKCard<Content: View>: View {

    // MARK: - Properties

    /// 目前是淺色還是深色外觀，深色下不畫陰影
    @Environment(\.colorScheme) private var colorScheme

    /// 卡片裡要放的內容
    private let content: Content

    /// 卡片看起來浮起多高
    private let elevation: LKCardElevation

    /// 內容是否貼齊卡片邊緣，放整張圖或整列清單時設為 true
    private let flush: Bool

    /// 卡片目前是否被選取，選取時邊框換成品牌色並加粗
    private let selected: Bool

    // MARK: - Init

    /// 建立一張卡片
    ///
    /// - Parameters:
    ///   - elevation: 卡片看起來浮起多高
    ///   - selected: 卡片目前是否被選取
    ///   - flush: 內容是否貼齊卡片邊緣
    ///   - content: 卡片裡要放的內容
    public init(
        elevation: LKCardElevation = .resting,
        selected: Bool = false,
        flush: Bool = false,
        @ViewBuilder content: () -> Content
    ) {
        self.elevation = elevation
        self.selected = selected
        self.flush = flush
        self.content = content()
    }

    // MARK: - Body

    /// 卡片的骨架：內容加上內距，再套上底色、外框與陰影
    public var body: some View {
        content
            .padding(contentPadding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(LKColor.bgSurface, in: LKShape.lg)
            .overlay {
                border
            }
            .clipShape(LKShape.lg)
            .shadow(color: shadowColor, radius: shadowRadius, y: shadowOffset)
    }
}

// MARK: - Private Views

private extension LKCard {

    /// 卡片的外框，被選取時換成品牌色並加粗
    var border: some View {
        LKShape.lg
            .stroke(borderColor, lineWidth: borderWidth)
    }
}

// MARK: - Nested Types

extension LKCard {

    /// 卡片自己的版面數值，只放沒有對應 token 的尺寸
    ///
    /// - Note: 一律 computed 不用 stored：`Layout` 巢狀在泛型型別裡時
    ///   static stored property 不合法，八個元件統一寫法才不用每次判斷
    private enum Layout {

        // MARK: - Computed Properties

        /// 貼著背景時的陰影濃度
        static var restingShadowOpacity: Double { 0.06 }

        /// 明顯浮起時的陰影濃度
        static var raisedShadowOpacity: Double { 0.08 }
    }
}

// MARK: - Computed Properties

private extension LKCard {

    /// 內容四周的內距，貼齊邊緣時為 0
    var contentPadding: CGFloat {
        if flush {
            0
        } else {
            LKSpacing.spacing16
        }
    }

    /// 外框的顏色
    var borderColor: Color {
        if selected {
            LKColor.brand
        } else {
            LKColor.borderSubtle
        }
    }

    /// 外框的粗細
    var borderWidth: CGFloat {
        if selected {
            LKSize.borderWStrong
        } else {
            LKSize.hairline
        }
    }

    /// 陰影的顏色，深色外觀下完全透明等於不畫
    var shadowColor: Color {
        Color.black.opacity(shadowOpacity)
    }

    /// 陰影的濃度；深色外觀靠底色分層，所以一律為 0
    var shadowOpacity: Double {
        if colorScheme == .dark {
            0
        } else {
            switch elevation {
            case .flat:
                0
            case .resting:
                Layout.restingShadowOpacity
            case .raised:
                Layout.raisedShadowOpacity
            }
        }
    }

    /// 陰影的模糊半徑
    var shadowRadius: CGFloat {
        switch elevation {
        case .flat:
            0
        case .resting:
            1
        case .raised:
            3
        }
    }

    /// 陰影往下偏移多少
    var shadowOffset: CGFloat {
        switch elevation {
        case .flat:
            0
        case .resting:
            1
        case .raised:
            2
        }
    }
}

// MARK: - Preview

#Preview("三種高度") {
    VStack(spacing: LKSpacing.spacing16) {
        LKCard(elevation: .flat) {
            Text("貼平在背景上")
                .font(LKFont.body)
        }

        LKCard {
            Text("預設高度")
                .font(LKFont.body)
        }

        LKCard(elevation: .raised, selected: true) {
            Text("浮起並被選取")
                .font(LKFont.body)
        }
    }
    .padding(LKSpacing.spacing16)
    .background(LKColor.bgCanvas)
}
