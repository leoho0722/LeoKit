package io.github.leoho0722.leokit.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 用加減鈕微調一個小整數。
 *
 * Android 沒有標準的 stepper，所以這是自繪的；也因此要自己補上 `stateDescription`，
 * 讓閱讀器唸得出目前的數字。
 * 範圍大或使用者可能想直接輸入時，用 [LKTextField] 的數字鍵盤，不要讓人按二十次。
 * 到邊界時對應的按鈕會停用。
 *
 * @param label 說明在調整什麼，唸給螢幕閱讀器聽
 * @param value 目前的值
 * @param onValueChange 使用者按了加或減時呼叫，參數是夾在範圍內的新值
 * @param valueRange 可調整的範圍
 * @param modifier 由呼叫端套在整組上的修飾子
 * @param step 每按一次跨多少
 * @param decreaseContentDescription 減少鈕唸給螢幕閱讀器的說明
 * @param increaseContentDescription 增加鈕唸給螢幕閱讀器的說明
 */
@Composable
public fun LKStepper(
    label: String,
    value: Int,
    onValueChange: (Int) -> Unit,
    valueRange: IntRange,
    modifier: Modifier = Modifier,
    step: Int = 1,
    decreaseContentDescription: String = "減少",
    increaseContentDescription: String = "增加",
) {
    val colors = LKTheme.colors

    Row(
        modifier = modifier
            .border(LKSize.hairline, colors.borderControl, LKShapes.md)
            .semantics {
                contentDescription = label
                stateDescription = value.toString()
            },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing4),
    ) {
        IconButton(
            onClick = { onValueChange((value - step).coerceIn(valueRange)) },
            enabled = value > valueRange.first,
        ) {
            Icon(
                imageVector = LKIcons.Minus,
                contentDescription = decreaseContentDescription,
                tint = colors.brand,
                modifier = Modifier.size(LKSize.iconMd),
            )
        }
        Text(
            text = value.toString(),
            style = LKTheme.typography.bodyStrong,
            color = colors.textPrimary,
            modifier = Modifier.defaultMinSize(minWidth = LKSize.iconLg),
        )
        IconButton(
            onClick = { onValueChange((value + step).coerceIn(valueRange)) },
            enabled = value < valueRange.last,
        ) {
            Icon(
                imageVector = LKIcons.Plus,
                contentDescription = increaseContentDescription,
                tint = colors.brand,
                modifier = Modifier.size(LKSize.iconMd),
            )
        }
    }
}
