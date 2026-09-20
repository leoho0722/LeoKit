package io.github.leoho0722.leokit.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/** 標記要傳達的意思，決定它的底色與文字顏色。 */
public enum class LKBadgeTone {
    /** 沒有好壞之分的標記：分類、標籤。 */
    Neutral,

    /** 跟品牌有關的標記：方案名稱、推薦項目。 */
    Brand,

    /** 已完成、成功、通過。 */
    Success,

    /** 要留意但還不算出錯。 */
    Warning,

    /** 失敗、過期、被拒絕。 */
    Danger,

    /** 未讀數量，用最醒目的紅底白字。 */
    Count,
}

/**
 * 不能點的狀態標記，例如「已發布」或未讀數量。
 *
 * 要讓使用者點的標籤請改用 Chip。
 * [label] 必須自己說明狀態，因為有些人看不出顏色的差別 ——
 * success 與 danger 在紅綠色盲視角下接近同色。
 *
 * @param label 標記上的文字，要能單獨說明狀態
 * @param modifier 由呼叫端套在整個標記上的修飾子
 * @param tone 要傳達的意思，決定底色與文字顏色
 * @param icon 文字前面的圖示；不放圖示時傳 null
 * @param dot 文字前面是否改畫一個小圓點；圓點優先於 [icon]
 */
@Composable
public fun LKBadge(
    label: String,
    modifier: Modifier = Modifier,
    tone: LKBadgeTone = LKBadgeTone.Neutral,
    icon: ImageVector? = null,
    dot: Boolean = false,
) {
    val colors = LKTheme.colors
    val container: Color = when (tone) {
        LKBadgeTone.Neutral -> colors.bgSubtle
        LKBadgeTone.Brand -> colors.brandSubtle
        LKBadgeTone.Success -> colors.successSubtle
        LKBadgeTone.Warning -> colors.warningSubtle
        LKBadgeTone.Danger -> colors.dangerSubtle
        LKBadgeTone.Count -> colors.danger
    }
    val content: Color = when (tone) {
        LKBadgeTone.Neutral -> colors.textSecondary
        LKBadgeTone.Brand -> colors.brandInk
        LKBadgeTone.Success -> colors.successInk
        LKBadgeTone.Warning -> colors.warningInk
        LKBadgeTone.Danger -> colors.dangerInk
        LKBadgeTone.Count -> colors.textOnDanger
    }

    Row(
        modifier = modifier
            .background(container, LKShapes.pill)
            .defaultMinSize(minHeight = 20.dp)
            .padding(horizontal = LKSpacing.spacing8, vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing4),
    ) {
        when {
            dot -> androidx.compose.foundation.layout.Box(
                modifier = Modifier.size(6.dp).background(content, CircleShape)
            )

            icon != null -> Icon(
                imageVector = icon,
                contentDescription = null,
                tint = content,
                modifier = Modifier.size(LKSize.iconSm),
            )
        }
        Text(text = label, style = LKTheme.typography.labelSm, color = content)
    }
}
