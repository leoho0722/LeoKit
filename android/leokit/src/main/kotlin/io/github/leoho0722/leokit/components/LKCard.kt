package io.github.leoho0722.leokit.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 卡片看起來浮起多高。
 *
 * 深色主題不用陰影表達高低，改用 bgElevated 那一階較亮的底色，所以深色下請用 [Flat]。
 */
public enum class LKCardElevation {
    /** 貼平在背景上，不畫陰影。 */
    Flat,

    /** 預設：貼著背景但有一點陰影。 */
    Resting,

    /** 明顯浮在其他內容之上，用於被拉出來強調的卡片。 */
    Raised,
}

/**
 * 把一組相關的內容收成一個看得出邊界的面。
 *
 * 卡片裡不要再放卡片，層層疊起來會讓人看不出哪一塊是重點。
 *
 * @param modifier 由呼叫端套在整張卡片上的修飾子
 * @param elevation 卡片看起來浮起多高
 * @param selected 卡片目前是否被選取；選取時邊框換成品牌色並加粗
 * @param flush 內容是否貼齊卡片邊緣；放整張圖或整列清單時設為 true
 * @param content 卡片裡要放的內容，以直排方式擺放
 */
@Composable
public fun LKCard(
    modifier: Modifier = Modifier,
    elevation: LKCardElevation = LKCardElevation.Resting,
    selected: Boolean = false,
    flush: Boolean = false,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = LKTheme.colors
    val tonal: Dp = when (elevation) {
        LKCardElevation.Flat -> 0.dp
        LKCardElevation.Resting -> 1.dp
        LKCardElevation.Raised -> 2.dp
    }
    Card(
        modifier = modifier,
        shape = LKShapes.lg,
        colors = CardDefaults.cardColors(
            containerColor = colors.bgSurface,
            contentColor = colors.textPrimary,
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = tonal),
        border = BorderStroke(
            width = if (selected) LKSize.borderWStrong else LKSize.hairline,
            color = if (selected) colors.brand else colors.borderSubtle,
        ),
    ) {
        Column(
            modifier = Modifier.padding(
                if (flush) PaddingValues(0.dp) else PaddingValues(LKSpacing.spacing16)
            ),
            content = content,
        )
    }
}
