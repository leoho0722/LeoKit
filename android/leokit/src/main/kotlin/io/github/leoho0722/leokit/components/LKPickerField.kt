package io.github.leoho0722.leokit.components

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 一個看起來像輸入框、按下去會打開原生選擇器的欄位。
 *
 * 這個元件只是「欄位」。它不持有值，也不自己彈出任何東西：
 * 選擇面請用 `ExposedDropdownMenuBox`、`DatePickerDialog` 或 [LKCombobox]。
 * 日期與時間一律用平台原生選擇器：時區、農曆、週起始日與語系格式系統都處理好了。
 * [value] 傳已經格式化好的字串，格式化規則屬於呼叫端的業務邏輯。
 * 選項只有兩三個且需要同時看見時，用 [LKRadio] 會比打開選擇面更快。
 *
 * @param label 欄位上方的標籤
 * @param onClick 按下欄位時要做的事，通常是打開原生選擇器
 * @param modifier 由呼叫端套在整個欄位上的修飾子
 * @param value 已經格式化好的顯示字串；還沒選時傳 null
 * @param placeholder 還沒選時顯示的提示文字
 * @param kind 這個欄位會打開哪一種原生選擇器，決定前面畫什麼圖示
 * @param help 欄位下方的說明；[errorText] 有值時會被蓋掉
 * @param errorText 錯誤訊息；有值時整格轉為錯誤樣式
 * @param enabled 這個欄位目前是否可以按
 */
@Composable
public fun LKPickerField(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    value: String? = null,
    placeholder: String = "請選擇",
    kind: LKPickerFieldKind = LKPickerFieldKind.Options,
    help: String? = null,
    errorText: String? = null,
    enabled: Boolean = true,
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography
    val isError = errorText != null
    val leading = when (kind) {
        LKPickerFieldKind.Options -> null
        LKPickerFieldKind.Date -> LKIcons.Calendar
        LKPickerFieldKind.Time -> LKIcons.Clock
    }

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(LKSpacing.spacing4),
    ) {
        Text(text = label, style = typography.subhead, color = colors.textSecondary)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .defaultMinSize(minHeight = LKSize.controlHMd)
                .border(
                    width = if (isError) LKSize.borderWStrong else LKSize.hairline,
                    color = if (isError) colors.danger else colors.borderControl,
                    shape = LKShapes.md,
                )
                .clickable(enabled = enabled, role = Role.Button, onClick = onClick)
                // label 是這個 Row 的 sibling，不寫進來的話 TalkBack 聚焦到這顆按鈕時
                // 只唸得到值，畫面上有兩個以上的欄位就分不出誰是誰
                .semantics(mergeDescendants = true) {
                    contentDescription = "$label，${value ?: placeholder}"
                    if (errorText != null) {
                        error(errorText)
                    }
                }
                .padding(horizontal = LKSpacing.spacing12),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing8),
        ) {
            if (leading != null) {
                Icon(
                    imageVector = leading,
                    contentDescription = null,
                    tint = colors.textTertiary,
                    modifier = Modifier.size(LKSize.iconMd),
                )
            }
            Text(
                text = value ?: placeholder,
                style = typography.body,
                color = if (value == null) colors.textTertiary else colors.textPrimary,
                modifier = Modifier.weight(1f),
            )
            Icon(
                imageVector = LKIcons.ChevronDown,
                contentDescription = null,
                tint = colors.textTertiary,
                modifier = Modifier.size(LKSize.iconSm),
            )
        }
        when {
            errorText != null -> Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing4),
            ) {
                Icon(
                    imageVector = LKIcons.Alert,
                    contentDescription = null,
                    tint = colors.dangerInk,
                    modifier = Modifier.size(LKSize.iconSm),
                )
                Text(text = errorText, style = typography.footnote, color = colors.dangerInk)
            }

            help != null ->
                Text(text = help, style = typography.footnote, color = colors.textSecondary)
        }
    }
}

/** 這個欄位會打開哪一種原生選擇器，決定它前面畫什麼圖示。 */
public enum class LKPickerFieldKind {
    /** 從一份清單裡選一個。 */
    Options,

    /** 選一個日期。 */
    Date,

    /** 選一個時間。 */
    Time,
}
