package io.github.leoho0722.leokit.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSize
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 一條進度軌道。
 *
 * 用 Material 的 `LinearProgressIndicator`。知道進度就給 [value]，
 * 不知道還要多久就傳 null，它會變成不確定狀態。
 * 進度只能往前，不要倒退；會倒退的數字用文字表達。
 * 整頁載入請用 [LKSkeleton]，不要用一條進度條代表整個畫面。
 *
 * @param contentDescription 說明在進行什麼，唸給螢幕閱讀器聽
 * @param modifier 由呼叫端套在軌道上的修飾子
 * @param value 目前進度，範圍 0 到 1；不知道還要多久時傳 null
 * @param successTone 是否為成功語氣，用於已完成的額度或用量
 */
@Composable
public fun LKProgress(
    contentDescription: String,
    modifier: Modifier = Modifier,
    value: Float? = null,
    successTone: Boolean = false,
) {
    val colors = LKTheme.colors
    val bar = if (successTone) colors.success else colors.brand
    val shared = modifier
        .fillMaxWidth()
        .height(LKSize.trackH)
        .semantics { this.contentDescription = contentDescription }

    if (value == null) {
        LinearProgressIndicator(
            modifier = shared,
            color = bar,
            trackColor = colors.bgInset,
        )
        return
    }
    LinearProgressIndicator(
        progress = { value.coerceIn(0f, 1f) },
        modifier = shared,
        color = bar,
        trackColor = colors.bgInset,
    )
}

/**
 * 轉圈圈。
 *
 * 只用在小範圍或按鈕內；整頁載入請用 [LKSkeleton]。
 *
 * @param contentDescription 說明在載入什麼，唸給螢幕閱讀器聽
 * @param modifier 由呼叫端套在圈圈上的修飾子
 */
@Composable
public fun LKSpinner(
    contentDescription: String = "載入中",
    modifier: Modifier = Modifier,
) {
    CircularProgressIndicator(
        modifier = modifier
            .size(LKSize.iconLg)
            .semantics { this.contentDescription = contentDescription },
        color = LKTheme.colors.brand,
        trackColor = LKTheme.colors.bgInset,
    )
}

/**
 * 內容還沒來時的佔位方塊。
 *
 * 純色不掃光：掃光動畫會把注意力吸引到還沒有內容的地方。
 * 只在第一次載入時用，重新整理請保留舊內容。
 * 佔位方塊本身對螢幕閱讀器沒有意義，載入狀態請由外層說明。
 *
 * @param modifier 由呼叫端套在方塊上的修飾子；寬度也由這裡給
 * @param shape 佔位方塊的形狀，對應它要頂替的內容
 */
@Composable
public fun LKSkeleton(
    modifier: Modifier = Modifier,
    shape: LKSkeletonShape = LKSkeletonShape.Line,
) {
    val corner = when (shape) {
        LKSkeletonShape.Line, LKSkeletonShape.Title -> LKShapes.xs
        LKSkeletonShape.Circle -> LKShapes.pill
    }
    val height = when (shape) {
        LKSkeletonShape.Line -> LKSpacing.spacing12
        LKSkeletonShape.Title -> LKSpacing.spacing20
        LKSkeletonShape.Circle -> LKSize.avatarMd
    }

    Box(
        modifier = modifier
            .height(height)
            .background(LKTheme.colors.bgSubtle, corner),
    )
}

/** 佔位方塊的形狀，對應它要頂替的內容。 */
public enum class LKSkeletonShape {
    /** 一行內文。 */
    Line,

    /** 一行標題，比內文高一些。 */
    Title,

    /** 一個頭像。 */
    Circle,
}
