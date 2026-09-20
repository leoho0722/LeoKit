package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.selection.selectable
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 從一組互斥的選項中選一個，且所有選項都要同時看得見。
 *
 * 一定要包在 [LKChoiceGroup] 裡並把 `singleChoice` 設為 true，互斥的焦點行為由它提供。
 * 選了就不能取消，只能換選別的，所以進畫面時就要有一個是選中的。
 * 每個選項可以帶一行說明，這是它比 [LKPickerField] 好用的主要理由。
 * 選項超過五個，或不需要同時看見時，改用 [LKPickerField]。
 *
 * @param label 選項的文字
 * @param selected 這個選項目前是否被選中
 * @param onSelect 使用者選了這一項時呼叫；已經選中時再點不會呼叫
 * @param modifier 由呼叫端套在整列上的修飾子
 * @param description 標籤下方的一行說明；不需要時傳 null
 * @param enabled 這一列目前是否可以點
 */
@Composable
public fun LKRadio(
    label: String,
    selected: Boolean,
    onSelect: () -> Unit,
    modifier: Modifier = Modifier,
    description: String? = null,
    enabled: Boolean = true,
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography

    Row(
        modifier = modifier
            .fillMaxWidth()
            .defaultMinSize(minHeight = LKSize.tapMinAndroid)
            .selectable(
                selected = selected,
                enabled = enabled,
                role = Role.RadioButton,
                onClick = { if (!selected) onSelect() },
            ),
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing8),
    ) {
        RadioButton(
            selected = selected,
            // 整列已經是命中區，圓圈本身不再接收點擊
            onClick = null,
            enabled = enabled,
            colors = RadioButtonDefaults.colors(
                selectedColor = colors.brand,
                unselectedColor = colors.borderControl,
            ),
        )
        Column(
            modifier = Modifier.defaultMinSize(minHeight = LKSize.tapMinAndroid),
            verticalArrangement = Arrangement.Center,
        ) {
            Text(text = label, style = typography.body, color = colors.textPrimary)
            if (description != null) {
                Text(text = description, style = typography.footnote, color = colors.textSecondary)
            }
        }
    }
}
