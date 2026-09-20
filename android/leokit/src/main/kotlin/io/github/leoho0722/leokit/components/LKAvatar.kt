package io.github.leoho0722.leokit.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize

/**
 * 代表一個人或一個服務的小圖。
 *
 * 退階順序是 [image]、[name] 的首字、人形字形。
 * 這個函式庫刻意不相依任何圖片載入器，所以 [image] 是一個插槽：
 * 由 App 傳入自己用的 Coil 或 Glide，載入失敗的退階也由 App 在那裡處理。
 * 圓形代表人、方形代表服務或品牌，這個形狀差異是語意不是裝飾。
 * 不要用名字去 hash 出隨機底色，那會產生大量沒驗證過對比的組合。
 *
 * @param modifier 由呼叫端套在整個頭像上的修飾子
 * @param name 完整名稱。沒有 [image] 時取首字，同時當作無障礙標籤
 * @param size 頭像的大小
 * @param square 是否用方形，代表服務或品牌
 * @param brandTone 是否用品牌色底，用於服務或方案
 * @param decorative 旁邊已經有名字文字時設為 true，對螢幕閱讀器隱藏
 * @param image 圖片插槽；傳 null 就退到首字或字形
 */
@Composable
public fun LKAvatar(
    modifier: Modifier = Modifier,
    name: String? = null,
    size: LKAvatarSize = LKAvatarSize.Medium,
    square: Boolean = false,
    brandTone: Boolean = false,
    decorative: Boolean = false,
    image: (@Composable () -> Unit)? = null,
) {
    val colors = LKTheme.colors
    val container = if (brandTone) colors.brandSubtle else colors.bgSubtle
    val content = if (brandTone) colors.brandInk else colors.textSecondary
    val shape = if (square) RoundedCornerShape(LKAvatarDefaults.SQUARE_RADIUS) else CircleShape
    val label = name.orEmpty()

    Box(
        modifier = modifier
            .size(size.length())
            .clip(shape)
            .background(container)
            .then(
                if (decorative || label.isEmpty()) {
                    Modifier.clearAndSetSemantics { }
                } else {
                    Modifier.semantics { contentDescription = label }
                }
            ),
        contentAlignment = Alignment.Center,
    ) {
        when {
            image != null -> image()

            !label.isEmpty() -> Text(
                text = lkAvatarInitials(label),
                style = size.textStyle(),
                color = content,
            )

            else -> Icon(
                imageVector = LKIcons.User,
                contentDescription = null,
                tint = content,
                modifier = Modifier.size(size.length() * LKAvatarDefaults.GLYPH_RATIO),
            )
        }
    }
}

/** 頭像的大小。 */
public enum class LKAvatarSize {
    /** 列表與疊加群組裡的小頭像。 */
    Small,

    /** 預設大小：列表列的前導、選單裡的使用者。 */
    Medium,

    /** 個人資料頁與卡片標頭。 */
    Large,
}

/**
 * 這個大小的頭像邊長。
 *
 * @return 邊長，單位為 dp
 */
internal fun LKAvatarSize.length(): Dp = when (this) {
    LKAvatarSize.Small -> LKSize.avatarSm
    LKAvatarSize.Medium -> LKSize.avatarMd
    LKAvatarSize.Large -> LKSize.avatarLg
}

/**
 * 首字要用哪一級字。
 *
 * @return 對應的文字樣式
 */
@Composable
internal fun LKAvatarSize.textStyle(): TextStyle = when (this) {
    LKAvatarSize.Small -> LKTheme.typography.labelSm
    LKAvatarSize.Medium -> LKTheme.typography.label
    LKAvatarSize.Large -> LKTheme.typography.title3
}

/**
 * 從完整名稱取出要顯示的首字。
 *
 * @param name 完整名稱
 * @return 中日韓取第一個字，拉丁字母取前兩個詞的首字母大寫
 */
internal fun lkAvatarInitials(name: String): String {
    val trimmed = name.trim()
    val first = trimmed.firstOrNull() ?: return ""
    if (first.isLetter() && first.code > 0x7F) return first.toString()
    return trimmed.split(" ")
        .filter { it.isNotEmpty() }
        .take(2)
        .mapNotNull { it.firstOrNull()?.uppercaseChar() }
        .joinToString("")
}

/** 頭像自己的版面數值，只放沒有對應 token 的尺寸。 */
private object LKAvatarDefaults {

    /** 方形頭像的圓角。 */
    val SQUARE_RADIUS: Dp = 6.dp

    /** 人形字形相對於整個頭像的比例。 */
    const val GLYPH_RATIO: Float = 0.5f
}
