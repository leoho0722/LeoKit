//
//  LKColor.generated.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

// LeoKit — 由 tokens/generate.mjs 產生，請勿手動編輯。
// 來源：tokens/tokens.json；要改 token 請改那裡，然後執行 `node tokens/generate.mjs`。

import SwiftUI

/// 畫面上可以直接用的顏色，會跟著系統的淺色或深色外觀自動換色
///
/// - Note: 需要知道某個主題的實際色值時才改讀 `LKColorValues`
public enum LKColor {

    // MARK: - Properties

    /// 頁面最底層背景
    ///
    /// - Note: iOS: systemGroupedBackground / Android: surfaceContainerLowest / Web: body
    /// - Note: 卡片與 sheet 疊在它之上
    public static let bgCanvas = LKColorValues.bgCanvas.color

    /// 卡片、列表、輸入框、sheet 的主要面
    ///
    /// - Note: iOS: secondarySystemGroupedBackground / Android: surface
    /// - Note: text-primary、text-secondary、text-tertiary 都可讀於此
    public static let bgSurface = LKColorValues.bgSurface.color

    /// 浮在 bg-surface 之上的面：popover、menu、dialog、bottom sheet
    ///
    /// - Note: 淺色靠 shadow-md 區分，深色靠自身較亮的色階區分
    public static let bgElevated = LKColorValues.bgElevated.color

    /// 次要填色：segmented control 軌道、chip、hover 底、skeleton
    ///
    /// - Note: iOS: tertiarySystemFill / Android: surfaceContainerHigh
    /// - Note: text-primary 與 text-secondary 可讀於此
    public static let bgSubtle = LKColorValues.bgSubtle.color

    /// 凹陷軌道：progress、slider track、程式碼區塊底
    ///
    /// - Note: 純裝飾填色，不可拿它當控制項的唯一邊界
    public static let bgInset = LKColorValues.bgInset.color

    /// modal、bottom sheet、drawer 後方的遮罩
    ///
    /// - Note: iOS: 系統預設 dimming / Android: scrim
    public static let bgScrim = LKColorValues.bgScrim.color

    /// 反轉面：toast／snackbar 的底，讓短暫訊息明顯不屬於頁面內容
    ///
    /// - Note: 只搭配 text-on-inverse 與 brand-on-inverse
    /// - Note: Android: inverseSurface
    public static let bgInverse = LKColorValues.bgInverse.color

    /// 主要文字與圖示，讀於 bg-canvas、bg-surface、bg-subtle、bg-inset（兩主題皆 ≥12:1）
    ///
    /// - Note: iOS: label / Android: onSurface
    public static let textPrimary = LKColorValues.textPrimary.color

    /// 次要說明、副標題、list row 的 subtitle，讀於 bg-canvas、bg-surface、bg-subtle（兩主題皆 ≥6.4:1）
    ///
    /// - Note: iOS: secondaryLabel / Android: onSurfaceVariant
    public static let textSecondary = LKColorValues.textSecondary.color

    /// placeholder、metadata、footnote，只讀於 bg-canvas 與 bg-surface（≥4.9:1）；不要放在 bg-subtle 上
    ///
    /// - Note: iOS: tertiaryLabel
    public static let textTertiary = LKColorValues.textTertiary.color

    /// 停用控制項的文字
    ///
    /// - Note: WCAG 對停用元件免除對比要求，因此停用狀態必須同時降低不透明度並移除互動，不可只靠這個色表達
    public static let textDisabled = LKColorValues.textDisabled.color

    /// brand、brand-hover、brand-pressed 填色上的文字與圖示（≥5.2:1）
    ///
    /// - Note: 深色主題的 brand 變亮，所以這裡是深墨色而不是白色 — 永遠用這個 token，不要寫死 white
    public static let textOnBrand = LKColorValues.textOnBrand.color

    /// danger 填色上的文字與圖示（≥5.7:1），用於破壞性主按鈕
    public static let textOnDanger = LKColorValues.textOnDanger.color

    /// bg-inverse 上的文字與圖示（兩主題皆 ≥14:1）
    ///
    /// - Note: 狀態色在反轉面上沒有足夠對比，所以 toast 的狀態要靠文字表達，不要用 success／danger 當前景
    public static let textOnInverse = LKColorValues.textOnInverse.color

    /// 唯一的品牌色：主按鈕填色、選取態、focus ring、連結
    ///
    /// - Note: 讀於 bg-surface 與 bg-canvas（≥5.4:1），也可當 ≥3:1 的圖示與邊框
    /// - Note: iOS: accentColor / Android: primary
    public static let brand = LKColorValues.brand.color

    /// brand 填色的 hover／focus 態（Web 與 Android 有指標時）
    ///
    /// - Note: iOS 不用 hover，改用 brand-pressed
    public static let brandHover = LKColorValues.brandHover.color

    /// brand 填色的按下態
    ///
    /// - Note: 三平台都必須有按下回饋：iOS 用這個色或 0.72 不透明度，Android 疊 state layer
    public static let brandPressed = LKColorValues.brandPressed.color

    /// 淡色品牌底：tonal button、選取中的 list row、資訊提示底
    ///
    /// - Note: 只搭配 brand-ink 當前景
    /// - Note: iOS: accentColor 的 quaternary fill / Android: secondaryContainer
    public static let brandSubtle = LKColorValues.brandSubtle.color

    /// brand-subtle 上的文字與圖示（≥8:1），也可當 bg-surface 上的強調文字
    public static let brandInk = LKColorValues.brandInk.color

    /// bg-inverse 上的動作文字，例如 toast 的「復原」（兩主題皆 ≥4.9:1）
    ///
    /// - Note: brand 本身在反轉面上對比不足，一律改用這個
    public static let brandOnInverse = LKColorValues.brandOnInverse.color

    /// 成功／完成的圖示與 ≥3:1 標記，讀於 bg-surface
    ///
    /// - Note: 不可單獨用色表示狀態，必須同時附文字或圖示
    public static let success = LKColorValues.success.color

    /// 成功 badge 與提示的底色，前景固定用 success-ink
    public static let successSubtle = LKColorValues.successSubtle.color

    /// success-subtle 與 bg-surface 上的成功文字（≥6.7:1）
    public static let successInk = LKColorValues.successInk.color

    /// 警示的圖示與標記，讀於 bg-surface
    ///
    /// - Note: 琥珀色在淺色主題必須壓到這個深度才有 4.5:1，不要改亮
    public static let warning = LKColorValues.warning.color

    /// 警示 badge 與提示的底色，前景固定用 warning-ink
    public static let warningSubtle = LKColorValues.warningSubtle.color

    /// warning-subtle 與 bg-surface 上的警示文字（≥7.2:1）
    public static let warningInk = LKColorValues.warningInk.color

    /// 錯誤與破壞性動作：填色按鈕、錯誤邊框、錯誤圖示
    ///
    /// - Note: 搭配 text-on-danger
    /// - Note: iOS: systemRed 的語意位置 / Android: error
    public static let danger = LKColorValues.danger.color

    /// 錯誤 badge 與表單錯誤區塊的底色，前景固定用 danger-ink
    public static let dangerSubtle = LKColorValues.dangerSubtle.color

    /// danger-subtle 與 bg-surface 上的錯誤文字（≥6.6:1），例如 TextField 的錯誤說明
    public static let dangerInk = LKColorValues.dangerInk.color

    /// 行內連結文字，別名指向 brand，兩主題都跟著 brand 走
    ///
    /// - Note: Web 連結一律加底線，不可只靠顏色區分
    public static let textLink = LKColorValues.textLink.color

    /// 純裝飾分隔線：list row 之間、卡片內的分段
    ///
    /// - Note: 不承載意義，因此不需 3:1
    /// - Note: iOS: separator / Android: outlineVariant
    public static let borderSubtle = LKColorValues.borderSubtle.color

    /// 卡片與容器的外框，且該容器另有填色或陰影可辨識時使用
    ///
    /// - Note: 若外框是唯一的辨識依據，改用 border-control
    public static let borderDefault = LKColorValues.borderDefault.color

    /// 需要被看見的裝飾性邊界：次要按鈕外框、表格外緣
    public static let borderStrong = LKColorValues.borderStrong.color

    /// 輸入框、checkbox、radio、switch 軌道等「靠邊框才能辨識」的控制項邊界，對 bg-surface、bg-canvas、bg-subtle 皆 ≥3:1，符合 WCAG
    /// 1.4.11
    public static let borderControl = LKColorValues.borderControl.color

    /// 鍵盤 focus ring，2px 實線加 2px offset，對所有它會落在的面皆 ≥3:1
    ///
    /// - Note: Web 用 outline，Android 用 focus indicator，iOS 由系統 focus engine 處理
    public static let borderFocus = LKColorValues.borderFocus.color
}
