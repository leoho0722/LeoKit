package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MenuDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 從一個觸發點展開的動作清單。
 *
 * 用 Material 的 `DropdownMenu`，展開位置、鍵盤行為與點外面關閉都由它處理。
 * 展開與收起的狀態由呼叫端持有，這個元件不自己記。
 * 行動端超過六項時不要用選單，改用 [LKSheet]。
 * 只有圖示的觸發點一定要有標籤，例如「更多動作」。
 *
 * @param expanded 選單目前是否展開
 * @param onDismissRequest 點外面或按返回時呼叫，呼叫端在這裡把它收起來
 * @param items 選單裡的項目，可以是動作、分隔線或群組標題
 * @param modifier 由呼叫端套在選單面上的修飾子
 */
@Composable
public fun LKMenu(
    expanded: Boolean,
    onDismissRequest: () -> Unit,
    items: List<LKMenuItem>,
    modifier: Modifier = Modifier,
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography

    DropdownMenu(
        expanded = expanded,
        onDismissRequest = onDismissRequest,
        modifier = modifier,
        shape = LKShapes.lg,
        containerColor = colors.bgElevated,
    ) {
        items.forEach { item ->
            when (item) {
                is LKMenuItem.Separator -> HorizontalDivider(color = colors.borderSubtle)

                is LKMenuItem.Group -> Text(
                    text = item.title,
                    style = typography.labelSm,
                    color = colors.textSecondary,
                    modifier = Modifier.padding(
                        horizontal = LKSpacing.spacing12,
                        vertical = LKSpacing.spacing8,
                    ),
                )

                is LKMenuItem.Action -> DropdownMenuItem(
                    text = {
                        Text(
                            text = item.label,
                            style = typography.body,
                            color = if (item.isDanger) colors.danger else colors.textPrimary,
                        )
                    },
                    onClick = item.onSelect,
                    leadingIcon = item.icon?.let {
                        {
                            Icon(
                                imageVector = it,
                                contentDescription = null,
                                modifier = Modifier.size(LKSize.iconMd),
                            )
                        }
                    },
                    trailingIcon = if (item.isChecked == true) {
                        {
                            Icon(
                                imageVector = LKIcons.Check,
                                contentDescription = null,
                                modifier = Modifier.size(LKSize.iconMd),
                            )
                        }
                    } else {
                        null
                    },
                    enabled = item.isEnabled,
                    colors = MenuDefaults.itemColors(
                        textColor = if (item.isDanger) colors.danger else colors.textPrimary,
                        leadingIconColor = if (item.isDanger) colors.danger else colors.textSecondary,
                        trailingIconColor = colors.brand,
                        disabledTextColor = colors.textDisabled,
                    ),
                )
            }
        }
    }
}

/** 選單裡的一個項目：動作、分隔線，或一組項目的小標題。 */
public sealed interface LKMenuItem {

    /** 一個可以選的動作。 */
    public data class Action(
        /** 動作的文字，用動詞開頭。 */
        public val label: String,
        /** 選了之後要做的事。 */
        public val onSelect: () -> Unit,
        /** 文字前面的圖示；不放圖示時是 null。 */
        public val icon: ImageVector? = null,
        /** 有值時這一項是單選項，選中會在尾端打勾；不是單選項時是 null。 */
        public val isChecked: Boolean? = null,
        /** 是否為破壞性動作，文字與圖示會轉成 danger 色。 */
        public val isDanger: Boolean = false,
        /** 這一項目前是否可以選。 */
        public val isEnabled: Boolean = true,
    ) : LKMenuItem

    /** 一條分隔線，用來把不同性質的動作分開。 */
    public data object Separator : LKMenuItem

    /** 一組項目的小標題。 */
    public data class Group(
        /** 這一組在說什麼。 */
        public val title: String,
    ) : LKMenuItem
}
