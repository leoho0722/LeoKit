package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 一格文字輸入，含上方標籤與下方說明。
 *
 * 標籤永遠留在輸入框上方 —— 不要拿 [placeholder] 當標籤，使用者一打字它就消失了。
 * [errorText] 有值時會同時做三件事：邊框轉紅並加粗、顯示帶圖示的錯誤訊息、
 * 把錯誤語意標記給螢幕閱讀器。
 *
 * @param value 目前輸入框裡的文字
 * @param onValueChange 使用者改了文字時呼叫，參數是改完後的整段文字
 * @param modifier 由呼叫端套在整格（含標籤與說明）上的修飾子
 * @param label 輸入框上方的標籤；不需要時傳 null
 * @param placeholder 還沒輸入時框內的提示文字；不需要時傳 null
 * @param helpText 輸入框下方的說明，例如格式要求；[errorText] 有值時會被蓋掉
 * @param errorText 錯誤訊息；有值時整格轉為錯誤樣式，沒錯時傳 null
 * @param leadingIcon 輸入框最前面的圖示；不放圖示時傳 null
 * @param enabled 這格目前是否可以輸入
 * @param singleLine 是否限制成單行；設為 false 時可以輸入多行
 */
@Composable
public fun LKTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    placeholder: String? = null,
    helpText: String? = null,
    errorText: String? = null,
    leadingIcon: ImageVector? = null,
    enabled: Boolean = true,
    singleLine: Boolean = true,
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography
    val isError = errorText != null

    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(LKSpacing.spacing4),
    ) {
        if (label != null) {
            Text(text = label, style = typography.subhead, color = colors.textSecondary)
        }
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .defaultMinSize(minHeight = LKSize.controlHMd)
                // 上方那個 Text 是這格的 sibling，不會成為輸入框的名稱。
                // 標籤得寫進輸入框自己的語意，TalkBack 才唸得出這格在問什麼。
                .then(
                    if (label != null) {
                        Modifier.semantics { contentDescription = label }
                    } else {
                        Modifier
                    },
                )
                .then(if (isError) Modifier.semantics { error(errorText) } else Modifier),
            enabled = enabled,
            isError = isError,
            singleLine = singleLine,
            textStyle = typography.body,
            shape = LKShapes.md,
            placeholder = placeholder?.let {
                { Text(text = it, style = typography.body, color = colors.textTertiary) }
            },
            leadingIcon = leadingIcon?.let {
                {
                    Icon(
                        imageVector = it,
                        contentDescription = null,
                        tint = colors.textTertiary,
                        modifier = Modifier.size(LKSize.iconMd),
                    )
                }
            },
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = colors.textPrimary,
                unfocusedTextColor = colors.textPrimary,
                focusedContainerColor = colors.bgSurface,
                unfocusedContainerColor = colors.bgSurface,
                // 「靠邊框才能辨識」的控制項用 borderControl，對三個面都有 3:1
                unfocusedBorderColor = colors.borderControl,
                focusedBorderColor = colors.borderFocus,
                errorBorderColor = colors.danger,
                cursorColor = colors.brand,
            ),
        )
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

            helpText != null ->
                Text(text = helpText, style = typography.footnote, color = colors.textSecondary)
        }
    }
}
