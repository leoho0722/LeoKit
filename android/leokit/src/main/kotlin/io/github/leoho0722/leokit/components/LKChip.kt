package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.size
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.InputChip
import androidx.compose.material3.InputChipDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize

/**
 * 一個可以點的短標籤：篩選、單選，或可移除的已選條件。
 *
 * 不能點的狀態標記請改用 [LKBadge]，這是兩者唯一的分界。
 * [removable] 為 true 時整個 Chip 的點擊就是「移除」，不再切換選取：
 * 一個 Chip 裡不放兩個可點目標。
 * 標籤用名詞、六個中文字以內，放不下就改用多選列表而不是截斷。
 * 篩選立即生效，不要再放「套用」按鈕；全部未選就等於不篩選，不需要「全部」這個 Chip。
 *
 * @param label 標籤的文字
 * @param onClick 點下去要做的事；[removable] 為 true 時這就是「移除」
 * @param modifier 由呼叫端套在整個 Chip 上的修飾子
 * @param selected 目前是否被選取；可移除的 Chip 永遠是未選取樣式
 * @param leadingIcon 標籤前面的圖示；不放圖示時傳 null
 * @param removable 尾端是否畫叉叉，表示點下去是移除
 * @param enabled 這個 Chip 目前是否可以點
 */
@Composable
public fun LKChip(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    selected: Boolean = false,
    leadingIcon: ImageVector? = null,
    removable: Boolean = false,
    enabled: Boolean = true,
) {
    val colors = LKTheme.colors
    val text: @Composable () -> Unit = {
        Text(text = label, style = LKTheme.typography.label)
    }
    val leading: (@Composable () -> Unit)? = leadingIcon?.let {
        {
            Icon(
                imageVector = it,
                contentDescription = null,
                modifier = Modifier.size(LKSize.iconSm),
            )
        }
    }

    if (removable) {
        InputChip(
            selected = false,
            onClick = onClick,
            label = text,
            modifier = modifier,
            enabled = enabled,
            leadingIcon = leading,
            trailingIcon = {
                Icon(
                    imageVector = LKIcons.Close,
                    contentDescription = null,
                    modifier = Modifier.size(LKSize.iconSm),
                )
            },
            shape = LKShapes.pill,
            colors = InputChipDefaults.inputChipColors(
                containerColor = colors.bgSurface,
                labelColor = colors.textSecondary,
                leadingIconColor = colors.textSecondary,
                trailingIconColor = colors.textSecondary,
            ),
            border = InputChipDefaults.inputChipBorder(
                enabled = enabled,
                selected = false,
                borderColor = colors.borderControl,
                borderWidth = LKSize.hairline,
            ),
        )
        return
    }
    FilterChip(
        selected = selected,
        onClick = onClick,
        label = text,
        modifier = modifier,
        enabled = enabled,
        leadingIcon = leading,
        shape = LKShapes.pill,
        colors = FilterChipDefaults.filterChipColors(
            containerColor = colors.bgSurface,
            labelColor = colors.textSecondary,
            iconColor = colors.textSecondary,
            selectedContainerColor = colors.brandSubtle,
            selectedLabelColor = colors.brandInk,
            selectedLeadingIconColor = colors.brandInk,
        ),
        // 選取態同時換底色與邊框色，不只靠底色深淺
        border = FilterChipDefaults.filterChipBorder(
            enabled = enabled,
            selected = selected,
            borderColor = colors.borderControl,
            selectedBorderColor = colors.brand,
            borderWidth = LKSize.hairline,
            selectedBorderWidth = LKSize.borderWStrong,
        ),
    )
}
