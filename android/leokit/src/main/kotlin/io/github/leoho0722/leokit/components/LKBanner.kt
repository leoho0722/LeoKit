package io.github.leoho0722.leokit.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/** 橫幅提示要傳達的意思，決定它的底色與文字顏色。 */
public enum class LKBannerTone {
    /** 單純說明一件事，沒有好壞。 */
    Neutral,

    /** 補充說明或使用提示。 */
    Info,

    /** 事情做完了、設定生效了。 */
    Success,

    /** 要留意的狀況，還可以繼續用。 */
    Warning,

    /** 出錯了，使用者得先處理才能繼續。 */
    Danger,
}

/**
 * 留在版面上的提示，用來說明一個一直存在的狀況。
 *
 * 會自己消失的提示不能承載一定要被讀到的訊息；那是 Toast 的工作。
 * 一個畫面最多一個橫幅；同時有多個狀況時只顯示最嚴重的那一個。
 * 使用者自己解決不了的問題不要給 [onDismiss]，給了就等於允許他忽略它。
 *
 * @param message 說明這個狀況的內容
 * @param modifier 由呼叫端套在整個橫幅上的修飾子
 * @param title 一行標題，只有訊息很長時才需要
 * @param tone 要傳達的意思，決定底色與文字顏色
 * @param icon 開頭的圖示；不放圖示時傳 null
 * @param onDismiss 按下關閉時要做的事；傳 null 表示這個提示不能被關掉
 * @param dismissContentDescription 關閉鈕唸給螢幕閱讀器聽的說明
 * @param actions 橫幅下方的動作按鈕；不需要時傳 null
 */
@Composable
public fun LKBanner(
    message: String,
    modifier: Modifier = Modifier,
    title: String? = null,
    tone: LKBannerTone = LKBannerTone.Neutral,
    icon: ImageVector? = null,
    onDismiss: (() -> Unit)? = null,
    dismissContentDescription: String = "關閉提示",
    actions: (@Composable RowScope.() -> Unit)? = null,
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography
    val container: Color = when (tone) {
        LKBannerTone.Neutral -> colors.bgSubtle
        LKBannerTone.Info -> colors.brandSubtle
        LKBannerTone.Success -> colors.successSubtle
        LKBannerTone.Warning -> colors.warningSubtle
        LKBannerTone.Danger -> colors.dangerSubtle
    }
    val content: Color = when (tone) {
        LKBannerTone.Neutral -> colors.textPrimary
        LKBannerTone.Info -> colors.brandInk
        LKBannerTone.Success -> colors.successInk
        LKBannerTone.Warning -> colors.warningInk
        LKBannerTone.Danger -> colors.dangerInk
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(container, LKShapes.md)
            .padding(horizontal = LKSpacing.spacing16, vertical = LKSpacing.spacing12)
            .semantics { liveRegion = if (tone == LKBannerTone.Danger) LiveRegionMode.Assertive else LiveRegionMode.Polite },
        horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing12),
    ) {
        if (icon != null) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = content,
                modifier = Modifier.size(LKSize.iconMd),
            )
        }
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(LKSpacing.spacing4),
        ) {
            if (title != null) {
                Text(text = title, style = typography.headline, color = content)
            }
            Text(text = message, style = typography.callout, color = content)
            if (actions != null) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing8),
                    verticalAlignment = Alignment.CenterVertically,
                    content = actions,
                )
            }
        }
        if (onDismiss != null) {
            IconButton(onClick = onDismiss, modifier = Modifier.size(LKSize.iconLg)) {
                Icon(
                    imageVector = LKIcons.Close,
                    contentDescription = dismissContentDescription,
                    tint = content,
                    modifier = Modifier.size(LKSize.iconSm),
                )
            }
        }
    }
}
