package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.style.TextAlign
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 一個區域目前沒有內容時該顯示什麼。
 *
 * Material 沒有對等元件，所以這是自繪的。
 * 標題用一句陳述加一個動作，不要只寫「沒有資料」。
 * 空狀態不是錯誤 —— 真的出錯請用 [LKBanner]，不要把錯誤畫成空狀態。
 * 最多兩個動作，第一個是主要動作。
 *
 * @param title 一句陳述，說明現在沒有什麼
 * @param modifier 由呼叫端套在整塊上的修飾子
 * @param message 說明接下來能做什麼；不需要時傳 null
 * @param icon 開頭的圖示；不放圖示時傳 null
 * @param compact 放在卡片或區塊裡時設為 true，上下留白減半
 * @param actions 標題下方的動作按鈕；不需要時傳 null
 */
@Composable
public fun LKEmptyState(
    title: String,
    modifier: Modifier = Modifier,
    message: String? = null,
    icon: ImageVector? = null,
    compact: Boolean = false,
    actions: (@Composable RowScope.() -> Unit)? = null,
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography
    val vertical = if (compact) LKSpacing.spacing24 else LKSpacing.spacing48

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = LKSpacing.spacing24, vertical = vertical),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(LKSpacing.spacing12),
    ) {
        if (icon != null) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = colors.textTertiary,
                modifier = Modifier.size(LKSize.iconXl),
            )
        }
        Text(
            text = title,
            style = typography.title3,
            color = colors.textPrimary,
            textAlign = TextAlign.Center,
        )
        if (message != null) {
            Text(
                text = message,
                style = typography.callout,
                color = colors.textSecondary,
                textAlign = TextAlign.Center,
            )
        }
        if (actions != null) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing8),
                verticalAlignment = Alignment.CenterVertically,
                content = actions,
            )
        }
    }
}
