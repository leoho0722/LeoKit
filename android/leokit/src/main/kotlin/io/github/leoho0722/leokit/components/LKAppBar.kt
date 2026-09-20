package io.github.leoho0722.leokit.components

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.TopAppBarScrollBehavior
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import io.github.leoho0722.leokit.LKTheme

/**
 * 畫面最上方的列：標題、返回，以及這個畫面層級的動作。
 *
 * Android 的標題一律靠左，這是平台慣例，不要為了跟 iOS 一致而置中。
 * 返回鍵在 Android 是輔助 —— 主要還是靠系統的返回手勢，所以 [navigationIcon] 可以不給。
 * 安全區的上內距由 `Scaffold` 處理，這個元件不處理。
 * 標題列最多放兩個圖示動作，更多請收進 [LKMenu]。
 *
 * @param title 這個畫面在說什麼，不要放 App 名稱
 * @param modifier 由呼叫端套在整列上的修飾子
 * @param navigationIcon 最前面的元素，通常是返回鍵；不需要時傳 null
 * @param actions 尾端的圖示動作，最多兩個；不需要時傳 null
 * @param scrollBehavior 跟著內容捲動改變外觀的行為，由 `Scaffold` 建立後傳進來
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
public fun LKAppBar(
    title: String,
    modifier: Modifier = Modifier,
    navigationIcon: (@Composable () -> Unit)? = null,
    actions: (@Composable () -> Unit)? = null,
    scrollBehavior: TopAppBarScrollBehavior? = null,
) {
    val colors = LKTheme.colors

    TopAppBar(
        title = {
            Text(text = title, style = LKTheme.typography.headline, color = colors.textPrimary)
        },
        modifier = modifier,
        navigationIcon = navigationIcon ?: {},
        actions = { actions?.invoke() },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = colors.bgSurface,
            scrolledContainerColor = colors.bgElevated,
            titleContentColor = colors.textPrimary,
            navigationIconContentColor = colors.textPrimary,
            actionIconContentColor = colors.brand,
        ),
        scrollBehavior = scrollBehavior,
    )
}
