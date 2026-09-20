package io.github.leoho0722.leokit.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.style.TextOverflow
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 列表裡的一列。
 *
 * 標題與副標題都只有一行，放不下就以省略號截斷 —— 需要多行的內容不該用這個元件。
 * 有 [onClick] 或 [showChevron] 就是可點的列，整列都是命中區。
 * 列上有開關時不要再讓整列可點：開關自己是唯一的命中區。
 *
 * @param title 這一列的主要文字
 * @param modifier 由呼叫端套在整列上的修飾子
 * @param subtitle 標題下方的一行說明；不需要時傳 null
 * @param value 尾端靠右對齊的數值或狀態文字；不需要時傳 null
 * @param leadingIcon 最前面的圖示；不放圖示時傳 null
 * @param trailing 尾端自訂的內容，例如開關或按鈕；不需要時傳 null
 * @param showChevron 尾端是否畫一個往右的箭頭，表示點下去會換頁
 * @param selected 這一列目前是否被選取；選取時底色與標題顏色都換成品牌色
 * @param onClick 點整列時要做的事；傳 null 表示這一列不可點
 */
@Composable
public fun LKListRow(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    value: String? = null,
    leadingIcon: ImageVector? = null,
    trailing: (@Composable () -> Unit)? = null,
    showChevron: Boolean = false,
    selected: Boolean = false,
    onClick: (() -> Unit)? = null,
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography
    val tappable = onClick != null || showChevron

    Row(
        modifier = modifier
            .fillMaxWidth()
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
            .then(if (selected) Modifier.background(colors.brandSubtle) else Modifier)
            .defaultMinSize(minHeight = LKSize.tapMinAndroid)
            .padding(horizontal = LKSpacing.spacing16, vertical = LKSpacing.spacing12),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing12),
    ) {
        if (leadingIcon != null) {
            Icon(
                imageVector = leadingIcon,
                contentDescription = null,
                tint = colors.brand,
                modifier = Modifier.size(LKSize.iconMd),
            )
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = typography.headline,
                color = if (selected) colors.brandInk else colors.textPrimary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            if (subtitle != null) {
                Text(
                    text = subtitle,
                    style = typography.footnote,
                    color = colors.textSecondary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
        if (value != null) {
            Text(text = value, style = typography.callout, color = colors.textSecondary)
        }
        if (trailing != null) {
            Box { trailing() }
        }
        if (tappable && showChevron) {
            Icon(
                imageVector = LKIcons.Chevron,
                contentDescription = null,
                tint = colors.textTertiary,
                modifier = Modifier.size(LKSize.iconMd),
            )
        }
    }
}
