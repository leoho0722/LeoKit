package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import io.github.leoho0722.leokit.LKTheme

/**
 * 在少數幾個互斥的檢視或篩選條件之間切換。
 *
 * 用 Material 的分段按鈕列，不自繪：自繪會失去平台的手感與輔助使用行為。
 * 放 2 到 4 個選項，全部同時看得見、不捲動；超過就改用可以左右滑動的 [LKTabs]。
 * 切換後下方內容要立刻改變，不要再要求使用者按「套用」。
 * 不要拿它當導覽列，換頁請用 [LKTabBar] 或 [LKAppBar]。
 *
 * @param labels 每一段的文字，用名詞而不是動詞，長度盡量接近
 * @param selectedIndex 目前選到第幾段，從 0 起算；沒有「全不選」狀態
 * @param onSelect 使用者選了某一段時呼叫，參數是那一段的位置
 * @param modifier 由呼叫端套在整排上的修飾子
 * @param contentDescription 說明這一排在切換什麼，唸給螢幕閱讀器聽
 * @param fullWidth 是否撐滿容器寬度；行動端建議 true
 */
@Composable
public fun LKSegmentedControl(
    labels: List<String>,
    selectedIndex: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    fullWidth: Boolean = true,
) {
    val colors = LKTheme.colors

    SingleChoiceSegmentedButtonRow(
        modifier = modifier
            .then(if (fullWidth) Modifier.fillMaxWidth() else Modifier)
            .then(
                if (contentDescription != null) {
                    Modifier.semantics { this.contentDescription = contentDescription }
                } else {
                    Modifier
                }
            ),
    ) {
        labels.forEachIndexed { index, label ->
            SegmentedButton(
                selected = index == selectedIndex,
                onClick = { onSelect(index) },
                shape = SegmentedButtonDefaults.itemShape(index = index, count = labels.size),
                colors = SegmentedButtonDefaults.colors(
                    activeContainerColor = colors.bgSurface,
                    activeContentColor = colors.textPrimary,
                    activeBorderColor = colors.borderControl,
                    inactiveContainerColor = colors.bgSubtle,
                    inactiveContentColor = colors.textSecondary,
                    inactiveBorderColor = colors.borderControl,
                ),
            ) {
                Text(text = label, style = LKTheme.typography.label)
            }
        }
    }
}
