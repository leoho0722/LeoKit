package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.SheetState
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 由下往上推出的面板。
 *
 * 用 Material 的 `ModalBottomSheet`，把手、拖曳關閉與預測性返回手勢都由它處理 ——
 * 自繪會失去這些行為。
 * 破壞性的選擇不要用面板，改用 [LKDialog]。
 * 標題會被朗讀成這個面板的名稱，所以即使視覺上不需要也建議給。
 *
 * @param title 面板的標題
 * @param onDismissRequest 使用者往下拖、點外面或按返回時呼叫，呼叫端在這裡把它關掉
 * @param modifier 由呼叫端套在面板上的修飾子
 * @param subtitle 標題下方的一行說明；不需要時傳 null
 * @param sheetState 面板的展開狀態，預設由 `rememberModalBottomSheetState()` 建立
 * @param content 面板裡的動作或表單內容，由上而下排列
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
public fun LKSheet(
    title: String,
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    sheetState: SheetState = rememberModalBottomSheetState(),
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography

    ModalBottomSheet(
        onDismissRequest = onDismissRequest,
        modifier = modifier,
        sheetState = sheetState,
        shape = LKShapes.xl,
        containerColor = colors.bgElevated,
        contentColor = colors.textPrimary,
        scrimColor = colors.bgScrim,
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    start = LKSpacing.spacing20,
                    end = LKSpacing.spacing20,
                    bottom = LKSpacing.spacing24,
                ),
            verticalArrangement = Arrangement.spacedBy(LKSpacing.spacing12),
        ) {
            Text(text = title, style = typography.title2, color = colors.textPrimary)
            if (subtitle != null) {
                Text(text = subtitle, style = typography.callout, color = colors.textSecondary)
            }
            content()
        }
    }
}
