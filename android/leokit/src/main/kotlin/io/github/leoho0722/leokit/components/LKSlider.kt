package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 在一個連續範圍裡挑一個值。
 *
 * 用 Material 的 `Slider`，拖曳手感與輔助使用行為都由它提供。
 * 目前的值一定要用文字顯示在旁邊：只有把手位置的滑桿沒有人看得懂。
 * 精確的數字用 [LKTextField] 或 [LKStepper]，滑桿適合「大概多少」的調整。
 * [format] 同時會寫進 `stateDescription`，所以請回傳帶單位的文字。
 *
 * @param label 欄位上方的標籤
 * @param value 目前的值
 * @param onValueChange 使用者拖動時呼叫，參數是新的值
 * @param valueRange 可調整的範圍
 * @param modifier 由呼叫端套在整個欄位上的修飾子
 * @param steps 範圍中間有幾個停留點；0 表示連續
 * @param help 欄位下方的說明；不需要時傳 null
 * @param successTone 是否為成功語氣，用於已完成的額度或用量
 * @param format 把數字轉成看得懂的文字，預設直接印出整數
 */
@Composable
public fun LKSlider(
    label: String,
    value: Float,
    onValueChange: (Float) -> Unit,
    valueRange: ClosedFloatingPointRange<Float>,
    modifier: Modifier = Modifier,
    steps: Int = 0,
    help: String? = null,
    successTone: Boolean = false,
    format: (Float) -> String = { it.toInt().toString() },
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography
    val bar = if (successTone) colors.success else colors.brand

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(LKSpacing.spacing4),
    ) {
        Text(text = label, style = typography.subhead, color = colors.textSecondary)
        Row(
            horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing12),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Slider(
                value = value,
                onValueChange = onValueChange,
                modifier = Modifier
                    .weight(1f)
                    .semantics {
                        contentDescription = label
                        stateDescription = format(value)
                    },
                valueRange = valueRange,
                steps = steps,
                colors = SliderDefaults.colors(
                    thumbColor = bar,
                    activeTrackColor = bar,
                    inactiveTrackColor = colors.bgInset,
                ),
            )
            Text(
                text = format(value),
                style = typography.bodyStrong,
                color = colors.textPrimary,
                // 與滑桿是同一個資訊，不要讓閱讀器念第二次
                modifier = Modifier.clearAndSetSemantics { },
            )
        }
        if (help != null) {
            Text(text = help, style = typography.footnote, color = colors.textSecondary)
        }
    }
}
