package io.github.leoho0722.leokit.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.Dp
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKOpacity
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/** 按鈕在畫面上的重要程度。一個畫面最多一個 [Primary]，也最多一個 [Destructive]。 */
public enum class LKButtonVariant {
    /** 使用者下一步該做的事。 */
    Primary,

    /** 同等重要的替代動作。 */
    Secondary,

    /** 有份量但非主要：匯入、分享。 */
    Tonal,

    /** 低調動作：工具列、卡片角落。 */
    Plain,

    /** 刪除、解除連結。一定要有二次確認。 */
    Destructive,
}

/** 按鈕的大小。[Medium] 高 44dp，同時滿足 Apple 與 Material 的最小可點範圍。 */
public enum class LKButtonSize {
    /** 擠在一起的版面裡的次要按鈕；不到 48dp，要靠周圍留白把可點範圍補足。 */
    Small,

    /** 預設大小，高 44dp。 */
    Medium,

    /** 主要行動按鈕、整列寬的按鈕、表單的送出。 */
    Large,
}

/**
 * LeoKit 的按鈕。
 *
 * [label] 用動詞開頭的祈使句（「新增訂閱」而不是「確定」）；
 * 會刪掉東西的按鈕要把後果寫在字面上（「刪除訂閱」而不是「確定」）。
 *
 * @param label 按鈕上的文字
 * @param onClick 按下之後要做的事
 * @param modifier 由呼叫端套在整顆按鈕上的修飾子
 * @param variant 按鈕在畫面上的重要程度
 * @param size 按鈕的大小
 * @param icon 文字前面的圖示；不放圖示時傳 null
 * @param enabled 按鈕目前是否可以按；停用時整顆變淡並且不再接受點擊
 * @param fullWidth 按鈕是否撐滿一整列
 */
@Composable
public fun LKButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: LKButtonVariant = LKButtonVariant.Primary,
    size: LKButtonSize = LKButtonSize.Medium,
    icon: ImageVector? = null,
    enabled: Boolean = true,
    fullWidth: Boolean = false,
) {
    val colors = LKTheme.colors
    val height: Dp = when (size) {
        LKButtonSize.Small -> LKSize.controlHSm
        LKButtonSize.Medium -> LKSize.controlHMd
        LKButtonSize.Large -> LKSize.controlHLg
    }
    val textStyle: TextStyle = when (size) {
        LKButtonSize.Small -> LKTheme.typography.labelSm
        LKButtonSize.Medium -> LKTheme.typography.label
        LKButtonSize.Large -> LKTheme.typography.labelLg
    }
    val container: Color = when (variant) {
        LKButtonVariant.Primary -> colors.brand
        LKButtonVariant.Secondary -> colors.bgSurface
        LKButtonVariant.Tonal -> colors.brandSubtle
        LKButtonVariant.Plain -> Color.Transparent
        LKButtonVariant.Destructive -> colors.danger
    }
    val content: Color = when (variant) {
        LKButtonVariant.Primary -> colors.textOnBrand
        LKButtonVariant.Secondary -> colors.textPrimary
        LKButtonVariant.Tonal -> colors.brandInk
        LKButtonVariant.Plain -> colors.brand
        LKButtonVariant.Destructive -> colors.textOnDanger
    }
    val border: BorderStroke? = when (variant) {
        LKButtonVariant.Secondary -> BorderStroke(LKSize.hairline, colors.borderStrong)
        else -> null
    }
    val horizontalPadding = when {
        variant == LKButtonVariant.Plain -> LKSpacing.spacing8
        size == LKButtonSize.Small -> LKSpacing.spacing12
        size == LKButtonSize.Large -> LKSpacing.spacing20
        else -> LKSpacing.spacing16
    }

    Button(
        onClick = onClick,
        modifier = modifier
            .then(if (fullWidth) Modifier.fillMaxWidth() else Modifier)
            .defaultMinSize(minHeight = height),
        enabled = enabled,
        shape = if (size == LKButtonSize.Small) LKShapes.sm else LKShapes.md,
        colors = ButtonDefaults.buttonColors(
            containerColor = container,
            contentColor = content,
            // 停用態靠整體不透明度表達，不另外換色
            disabledContainerColor = container.copy(alpha = LKOpacity.opacityDisabled),
            disabledContentColor = content.copy(alpha = LKOpacity.opacityDisabled),
        ),
        border = border,
        contentPadding = PaddingValues(horizontal = horizontalPadding),
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing8),
        ) {
            if (icon != null) {
                Icon(imageVector = icon, contentDescription = null, modifier = Modifier.size(LKSize.iconMd))
            }
            Text(text = label, style = textStyle)
        }
    }
}
