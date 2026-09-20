//
//  LKSize.generated.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

// LeoKit — 由 tokens/generate.mjs 產生，請勿手動編輯。
// 來源：tokens/tokens.json；要改 token 請改那裡，然後執行 `node tokens/generate.mjs`。

import Foundation

/// 控制項高度、圖示、頭像與邊框寬度的固定尺寸，單位為 pt
public enum LKSize {

    // MARK: - Properties

    /// 密集介面中的次要按鈕與 chip
    ///
    /// - Note: 低於 44 時必須靠外距把可點擊範圍補到平台最小值
    public static let controlHSm: CGFloat = 32

    /// 預設按鈕與輸入框高度，同時滿足 iOS 的 44pt 最小觸控
    public static let controlHMd: CGFloat = 44

    /// 主要行動按鈕、全寬 CTA、表單送出
    public static let controlHLg: CGFloat = 52

    /// iOS 最小可點擊邊長（HIG）
    ///
    /// - Note: 圖示按鈕即使視覺只有 20px，命中區也要撐到這個值
    public static let tapMinIos: CGFloat = 44

    /// Android 最小可點擊邊長（Material accessibility）
    ///
    /// - Note: Android 版的圖示按鈕用這個值
    public static let tapMinAndroid: CGFloat = 48

    /// 行內圖示、badge 內圖示、按鈕內的小圖示
    public static let iconSm: CGFloat = 16

    /// 預設圖示尺寸：按鈕、list row leading、app bar action
    public static let iconMd: CGFloat = 20

    /// tab bar 圖示、較大的 list row leading
    public static let iconLg: CGFloat = 24

    /// 空狀態與功能入口的圖示
    public static let iconXl: CGFloat = 28

    /// checkbox 與 radio 的方框邊長
    ///
    /// - Note: 方框本身小於觸控最小值，命中區靠整列（標籤一起）撐到 control-h-md
    public static let choiceSize: CGFloat = 20

    /// 列表內的小頭像、疊加頭像群
    public static let avatarSm: CGFloat = 28

    /// 預設頭像尺寸：list row leading、選單中的使用者
    public static let avatarMd: CGFloat = 36

    /// 個人資料頁與卡片標頭的頭像
    public static let avatarLg: CGFloat = 48

    /// 進度條與 slider 的軌道高度
    ///
    /// - Note: 填色與軌道之間需 ≥3:1，所以軌道固定用 bg-inset、填色用 brand 或 success
    public static let trackH: CGFloat = 6

    /// slider 拖曳把手直徑
    ///
    /// - Note: iOS 的原生把手 28pt、Android 20dp，行動端交給平台元件即可
    public static let sliderThumb: CGFloat = 24

    /// 底部主導覽的高度（不含安全區）
    ///
    /// - Note: iOS tab bar 為 49pt 加安全區，Android navigation bar 為 80dp — 行動端以平台值為準
    public static let tabbarH: CGFloat = 56

    /// 分隔線與邊框寬度
    ///
    /// - Note: iOS 上請用 1 physical pixel 的 divider，不要用 1pt
    public static let hairline: CGFloat = 1

    /// 需要更明確的邊界：錯誤態輸入框、選取中的卡片
    public static let borderWStrong: CGFloat = 1.5

    /// focus ring 線寬，搭配 border-focus
    public static let focusRingW: CGFloat = 2

    /// focus ring 與元件邊緣的距離，讓 ring 不與邊框混在一起
    public static let focusRingOffset: CGFloat = 2

    /// Web 長文與表單的最大寬度，維持每行 60–75 字元
    public static let contentMax: CGFloat = 720

    /// Web 應用版面的最大寬度
    public static let layoutMax: CGFloat = 1120
}
