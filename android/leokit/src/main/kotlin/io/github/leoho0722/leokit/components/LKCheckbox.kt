package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.selection.triStateToggleable
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TriStateCheckbox
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.state.ToggleableState
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 從一組選項中多選，或同意一個條件。
 *
 * 要按「儲存」才生效的選項用這個；切換後立刻生效的用 [LKToggle]。
 * 整列（方框、標籤、說明）都是命中區，最小高度撐到 48dp。
 * [ToggleableState.Indeterminate] 表示父項只勾了一部分，方框會畫橫線；
 * 點一下之後一律變成全選，不會回到部分勾選。
 *
 * @param label 選項的文字，可以換行
 * @param state 目前的勾選狀態：勾、不勾，或部分勾選
 * @param onStateChange 使用者點了這一列時呼叫，參數是點完後應該變成的狀態
 * @param modifier 由呼叫端套在整列上的修飾子
 * @param description 標籤下方的一行說明；不需要時傳 null
 * @param enabled 這一列目前是否可以點
 */
@Composable
public fun LKCheckbox(
    label: String,
    state: ToggleableState,
    onStateChange: (ToggleableState) -> Unit,
    modifier: Modifier = Modifier,
    description: String? = null,
    enabled: Boolean = true,
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography
    val next = if (state == ToggleableState.On) ToggleableState.Off else ToggleableState.On

    Row(
        modifier = modifier
            .fillMaxWidth()
            .defaultMinSize(minHeight = LKSize.tapMinAndroid)
            .triStateToggleable(
                state = state,
                enabled = enabled,
                role = Role.Checkbox,
                onClick = { onStateChange(next) },
            ),
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing8),
    ) {
        TriStateCheckbox(
            state = state,
            // 整列已經是命中區，方框本身不再接收點擊，否則會有兩個可點目標
            onClick = null,
            enabled = enabled,
            colors = CheckboxDefaults.colors(
                checkedColor = colors.brand,
                uncheckedColor = colors.borderControl,
                checkmarkColor = colors.textOnBrand,
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

/**
 * 只有勾與不勾的多選項。
 *
 * 不需要「部分勾選」時用這個，少一層 [ToggleableState] 轉換。
 *
 * @param label 選項的文字，可以換行
 * @param checked 目前是否勾選
 * @param onCheckedChange 使用者點了這一列時呼叫，參數是點完後的勾選狀態
 * @param modifier 由呼叫端套在整列上的修飾子
 * @param description 標籤下方的一行說明；不需要時傳 null
 * @param enabled 這一列目前是否可以點
 */
@Composable
public fun LKCheckbox(
    label: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    description: String? = null,
    enabled: Boolean = true,
) {
    LKCheckbox(
        label = label,
        state = if (checked) ToggleableState.On else ToggleableState.Off,
        onStateChange = { onCheckedChange(it == ToggleableState.On) },
        modifier = modifier,
        description = description,
        enabled = enabled,
    )
}
