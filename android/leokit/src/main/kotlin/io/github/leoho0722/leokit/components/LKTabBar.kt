package io.github.leoho0722.leokit.components

import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import io.github.leoho0722.leokit.LKTheme

/**
 * App 的主導覽：在 3 到 5 個平行的頂層區塊之間切換。
 *
 * 用 Material 的 `NavigationBar`，選中項那個膠囊形狀的 indicator 是 Material 的 state layer，
 * 不要拿掉：它是「現在在哪一區」除了顏色之外的第二個線索。
 * 超過 5 個頂層區塊時不要塞進來，改用 `NavigationDrawer`。
 * 導覽狀態由呼叫端（或平台的導覽器）持有，這個元件不自己記。
 *
 * @param items 每一個頂層區塊；超過 5 個只會顯示前 5 個
 * @param selectedValue 目前在哪一個頂層區塊，對應 [LKTabBarItem.value]
 * @param onSelect 使用者切換區塊時呼叫，參數是那一區的值
 * @param modifier 由呼叫端套在整列上的修飾子
 */
@Composable
public fun LKTabBar(
    items: List<LKTabBarItem>,
    selectedValue: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val colors = LKTheme.colors

    NavigationBar(
        modifier = modifier,
        containerColor = colors.bgSurface,
        contentColor = colors.textSecondary,
    ) {
        items.take(5).forEach { item ->
            NavigationBarItem(
                selected = item.value == selectedValue,
                onClick = { onSelect(item.value) },
                icon = {
                    if (item.badge == null) {
                        Icon(imageVector = item.icon, contentDescription = null)
                    } else {
                        BadgedBox(badge = { Badge { Text(text = item.badge) } }) {
                            Icon(imageVector = item.icon, contentDescription = null)
                        }
                    }
                },
                label = { Text(text = item.label, style = LKTheme.typography.caption) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = colors.brandInk,
                    selectedTextColor = colors.brandInk,
                    indicatorColor = colors.brandSubtle,
                    unselectedIconColor = colors.textSecondary,
                    unselectedTextColor = colors.textSecondary,
                ),
            )
        }
    }
}

/** 主導覽裡的一個頂層區塊。 */
public data class LKTabBarItem(
    /** 區塊名稱，用名詞、四個中文字以內。 */
    public val label: String,
    /** 區塊的圖示，請用成對的實心與線條變體之一。 */
    public val icon: ImageVector,
    /** 這一區代表的值，用來比對目前選到哪一區。 */
    public val value: String,
    /** 圖示右上角的數量標記；不需要時是 null。 */
    public val badge: String? = null,
)
