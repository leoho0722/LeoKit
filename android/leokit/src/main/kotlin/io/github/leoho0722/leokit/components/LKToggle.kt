package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.selection.toggleable
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 開關一個切換後立刻生效的設定。
 *
 * 標籤寫「開啟後會發生什麼」的肯定句 —— 否定句配開關會讓人分不清方向。
 * 沒有中間態，也沒有「取消」；切換後若可能失敗，先樂觀切換，失敗時回復原狀並用 Toast 說明。
 * 需要按「儲存」才生效的選項用 [LKCheckbox]，不要用這個。
 * 放進 [LKListRow] 的尾端時不要傳 [label]，說明文字交給列的標題與副標題，
 * 而且此時整列不可再可點 —— 開關自己是唯一的命中區。
 *
 * @param checked 目前是否開啟
 * @param onCheckedChange 使用者切換時呼叫，參數是切換後的狀態
 * @param modifier 由呼叫端套在整個元件上的修飾子
 * @param label 開關旁邊的文字；放進列表尾端時傳 null
 * @param contentDescription 沒有 [label] 時唸給螢幕閱讀器的說明
 * @param enabled 這個開關目前是否可以切換
 */
@Composable
public fun LKToggle(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    contentDescription: String? = null,
    enabled: Boolean = true,
) {
    val colors = LKTheme.colors
    val switchColors = SwitchDefaults.colors(
        checkedTrackColor = colors.brand,
        checkedThumbColor = colors.textOnBrand,
        // 關閉時不可只靠灰色深淺，邊框是它在高對比模式下的辨識依據
        uncheckedTrackColor = colors.bgSubtle,
        uncheckedBorderColor = colors.borderControl,
        uncheckedThumbColor = colors.textSecondary,
    )

    if (label == null) {
        Row(modifier = modifier) {
            Switch(
                checked = checked,
                onCheckedChange = onCheckedChange,
                enabled = enabled,
                modifier = if (contentDescription != null) {
                    Modifier.semantics { this.contentDescription = contentDescription }
                } else {
                    Modifier
                },
                colors = switchColors,
            )
        }
        return
    }

    // 整列是一個 toggleable 的節點：名稱來自 Text，角色與狀態來自開關。
    // 只把 Text 放在 Switch 旁邊當同級子項的話，TalkBack 不會拿它當開關的名稱，
    // 聚焦上去只會唸成一個沒有標籤的開關。
    Row(
        modifier = modifier
            .fillMaxWidth()
            .defaultMinSize(minHeight = LKSize.tapMinAndroid)
            .toggleable(
                value = checked,
                enabled = enabled,
                role = Role.Switch,
                onValueChange = onCheckedChange,
            ),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing12),
    ) {
        Text(
            text = label,
            style = LKTheme.typography.body,
            color = colors.textPrimary,
            modifier = Modifier.weight(1f),
        )
        // onCheckedChange = null：命中區是整列，開關自己不再是第二個可點目標
        Switch(
            checked = checked,
            onCheckedChange = null,
            enabled = enabled,
            colors = switchColors,
        )
    }
}
