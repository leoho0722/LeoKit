//
//  LKOpacity.generated.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/19.
//

// LeoKit — 由 tokens/generate.mjs 產生，請勿手動編輯。
// 來源：tokens/tokens.json；要改 token 請改那裡，然後執行 `node tokens/generate.mjs`。

/// 停用、按下、滑過與選取這些狀態要疊上的不透明度
///
/// - Note: 只靠不透明度表達狀態是不夠的，一定要同時改變互動行為或文字
public enum LKOpacity {

    // MARK: - Properties

    /// 停用態整體不透明度，必須同時移除互動與 aria-disabled
    public static let opacityDisabled: Double = 0.4

    /// iOS 風格按下回饋（沒有專用 pressed 色時使用）
    public static let opacityPressed: Double = 0.72

    /// Web 與 Android 指標 hover 時疊在元件上的 text-primary 層
    public static let opacityHoverLayer: Double = 0.06

    /// 選取態疊層的 brand 不透明度：selected list row、selected chip
    public static let opacitySelectedLayer: Double = 0.12
}
