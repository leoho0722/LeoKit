package io.github.leoho0722.leokit.components

import androidx.compose.material3.Snackbar
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme

/**
 * 短暫的操作回饋。
 *
 * Snackbar 是 Android 的原生慣例，所以直接用 `SnackbarHost`：把這個放進 `Scaffold` 的
 * `snackbarHost`，然後用 `SnackbarHostState.showSnackbar()` 顯示。
 * 排隊與自動消失都由 `SnackbarHostState` 管，這個元件只負責外觀。
 * 回饋不搶焦點；帶動作時那個動作必須也能從別處觸達，因為鍵盤使用者可能來不及碰到它。
 * 狀態要靠文字說明：反轉面上的狀態色對比不足，不要拿 success 當前景色。
 *
 * @param hostState 由呼叫端建立並持有的 Snackbar 狀態
 * @param modifier 由呼叫端套在整個容器上的修飾子
 */
@Composable
public fun LKToastHost(hostState: SnackbarHostState, modifier: Modifier = Modifier) {
    val colors = LKTheme.colors

    SnackbarHost(hostState = hostState, modifier = modifier) { data ->
        Snackbar(
            snackbarData = data,
            shape = LKShapes.md,
            containerColor = colors.bgInverse,
            contentColor = colors.textOnInverse,
            // brand 在反轉面上對比不足，動作一律用專用的 token
            actionColor = colors.brandOnInverse,
            dismissActionContentColor = colors.textOnInverse,
        )
    }
}
