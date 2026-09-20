package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.PrimaryScrollableTabRow
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 在同一層級的幾個內容區之間切換的頂部 tab 列。
 *
 * 換頁請改用 [LKTabBar]，這一列只切換同一個畫面裡的內容區。
 * 一定要搭配 `HorizontalPager`：Android 的 tab 必須能左右滑動切換，少了它就不符合平台慣例。
 * [fill] 為 true 時平分寬度（2 到 3 個 tab），false 時整排可以橫向捲動。
 *
 * @param items 這一排要顯示哪些 tab
 * @param selectedValue 目前選到哪一個，對應 [LKTabItem.value]
 * @param onSelect 使用者選了某個 tab 時呼叫，參數是那個 tab 的值
 * @param modifier 由呼叫端套在整排上的修飾子
 * @param fill 是否平分寬度；false 時整排可以橫向捲動
 */
@Composable
public fun LKTabs(
    items: List<LKTabItem>,
    selectedValue: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    fill: Boolean = true,
) {
    val colors = LKTheme.colors
    val selectedIndex = items.indexOfFirst { it.value == selectedValue }.coerceAtLeast(0)
    val tabs: @Composable () -> Unit = {
        items.forEachIndexed { index, item ->
            Tab(
                selected = index == selectedIndex,
                onClick = { onSelect(item.value) },
                selectedContentColor = colors.brand,
                unselectedContentColor = colors.textSecondary,
            ) {
                LKTabLabel(item)
            }
        }
    }

    if (fill) {
        PrimaryTabRow(
            selectedTabIndex = selectedIndex,
            modifier = modifier,
            containerColor = colors.bgSurface,
            contentColor = colors.brand,
            tabs = tabs,
        )
        return
    }
    PrimaryScrollableTabRow(
        selectedTabIndex = selectedIndex,
        modifier = modifier,
        containerColor = colors.bgSurface,
        contentColor = colors.brand,
        tabs = tabs,
    )
}

/**
 * 單一個 tab 的內容：圖示、文字、數量標記。
 *
 * @param item 要畫的 tab
 */
@Composable
private fun LKTabLabel(item: LKTabItem) {
    Row(
        modifier = Modifier.padding(
            horizontal = LKSpacing.spacing12,
            vertical = LKSpacing.spacing12,
        ),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing4),
    ) {
        if (item.icon != null) {
            Icon(
                imageVector = item.icon,
                contentDescription = null,
                modifier = Modifier.size(LKSize.iconSm),
            )
        }
        Text(text = item.label, style = LKTheme.typography.label)
        if (item.badge != null) {
            LKBadge(label = item.badge, tone = LKBadgeTone.Neutral)
        }
    }
}

/** 頂部 tab 列裡的一個 tab。 */
public data class LKTabItem(
    /** tab 上的文字，用名詞。 */
    public val label: String,
    /** 這個 tab 代表的值，用來比對目前選到哪一個。 */
    public val value: String,
    /** 文字前面的圖示；不放圖示時是 null。 */
    public val icon: ImageVector? = null,
    /** 尾端的數量標記；不需要時是 null。 */
    public val badge: String? = null,
)
