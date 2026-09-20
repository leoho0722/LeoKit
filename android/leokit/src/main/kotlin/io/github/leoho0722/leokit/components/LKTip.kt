package io.github.leoho0722.leokit.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 功能發現提示：告訴使用者「這裡還能做什麼」。
 *
 * Material 沒有對等元件，所以這是自繪的。
 * 提示不搶焦點 —— 它是補充資訊，不是需要處理的事情。
 * 關閉鈕的文字要說清楚後果（「不再顯示這個提示」而不是「關閉」），因為按下去是永久的。
 * 要不要顯示請先問 [lkTipShouldShow]，顯示與關閉之後把新的 [LKTipRecord] 存進 DataStore。
 *
 * @param title 一句話說這個功能能做什麼
 * @param modifier 由呼叫端套在整塊提示上的修飾子
 * @param message 補充說明；不需要時傳 null
 * @param icon 開頭的圖示，預設是燈泡
 * @param onDismiss 按下關閉時要做的事；傳 null 就不顯示關閉鈕
 * @param dismissContentDescription 關閉鈕唸給螢幕閱讀器的說明
 * @param actions 提示下方的動作按鈕；不需要時傳 null
 */
@Composable
public fun LKTip(
    title: String,
    modifier: Modifier = Modifier,
    message: String? = null,
    icon: ImageVector = LKIcons.Lightbulb,
    onDismiss: (() -> Unit)? = null,
    dismissContentDescription: String = "不再顯示這個提示",
    actions: (@Composable RowScope.() -> Unit)? = null,
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography

    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(colors.brandSubtle, LKShapes.md)
            .padding(horizontal = LKSpacing.spacing16, vertical = LKSpacing.spacing12),
        horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing12),
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = colors.brandInk,
            modifier = Modifier.size(LKSize.iconMd),
        )
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(LKSpacing.spacing4),
        ) {
            Text(text = title, style = typography.headline, color = colors.brandInk)
            if (message != null) {
                Text(text = message, style = typography.callout, color = colors.brandInk)
            }
            if (actions != null) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing8),
                    content = actions,
                )
            }
        }
        if (onDismiss != null) {
            IconButton(onClick = onDismiss, modifier = Modifier.size(LKSize.iconLg)) {
                Icon(
                    imageVector = LKIcons.Close,
                    contentDescription = dismissContentDescription,
                    tint = colors.brandInk,
                    modifier = Modifier.size(LKSize.iconSm),
                )
            }
        }
    }
}

/**
 * 一個提示的顯示規則。
 *
 * 三端的欄位刻意保持一致（iOS 交給 TipKit、Web 存 localStorage），
 * 這樣「哪些提示、什麼時候出現」可以寫成一份跨平台的清單。
 */
public data class LKTipRule(
    /** 這個提示的識別碼，跨平台共用同一個字串。 */
    public val id: String,
    /** 最多顯示幾次。 */
    public val maxDisplays: Int = 1,
)

/** 一個提示到目前為止的狀態，由呼叫端存在 DataStore 裡。 */
public data class LKTipRecord(
    /** 已經顯示過幾次。 */
    public val shown: Int = 0,
    /** 使用者是否已經按過「不再顯示」。 */
    public val isDone: Boolean = false,
)

/**
 * 這個提示現在該不該顯示。
 *
 * 判斷邏輯刻意與 Web 的 `tipShouldShow` 一致，方便跨平台對照。
 * 讀不到狀態時傳預設的 [LKTipRecord] 進來就好 —— 寧可多顯示一次，也不要該顯示卻不顯示。
 *
 * @param rule 這個提示的顯示規則
 * @param record 這個提示到目前為止的狀態
 * @param condition 額外條件，回傳 false 就不顯示
 * @return 現在是否該顯示這個提示
 */
public fun lkTipShouldShow(
    rule: LKTipRule,
    record: LKTipRecord,
    condition: () -> Boolean = { true },
): Boolean {
    if (rule.id.isEmpty()) return true
    if (!condition()) return false
    if (record.isDone) return false
    return record.shown < rule.maxDisplays
}
