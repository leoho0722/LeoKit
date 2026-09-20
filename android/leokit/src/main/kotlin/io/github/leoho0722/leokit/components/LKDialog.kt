package io.github.leoho0722.leokit.components

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import io.github.leoho0722.leokit.LKShapes
import io.github.leoho0722.leokit.LKTheme

/**
 * 打斷使用者、要求一個決定的對話框。
 *
 * 用 Material 的 `AlertDialog`，焦點鎖與預測性返回手勢都由它處理。
 * 設計系統的約定編在參數裡：一定要有取消、破壞性動作用 danger 色，
 * 而且 Android 與 Web 的按鈕是水平靠右、取消在左（iOS 相反，照平台走，不要統一）。
 * 不要拿對話框問可以就地處理的事，也不要用它顯示載入中。
 *
 * @param title 用問句或結果句，會被朗讀成這個對話框的名稱
 * @param confirmLabel 確認按鈕的文字，寫動詞加受詞，例如「刪除訂閱」
 * @param onConfirm 使用者按下確認時要做的事
 * @param onDismissRequest 使用者按返回、點外面或按取消時呼叫，呼叫端在這裡把它關掉
 * @param modifier 由呼叫端套在對話框上的修飾子
 * @param message 說明後果，不要重複標題；不需要時傳 null
 * @param isDestructive 這個動作是否收不回來；true 時確認按鈕轉為 danger 色
 * @param cancelLabel 取消按鈕的文字
 */
@Composable
public fun LKDialog(
    title: String,
    confirmLabel: String,
    onConfirm: () -> Unit,
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    message: String? = null,
    isDestructive: Boolean = false,
    cancelLabel: String = "取消",
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography

    AlertDialog(
        onDismissRequest = onDismissRequest,
        confirmButton = {
            TextButton(onClick = onConfirm) {
                Text(
                    text = confirmLabel,
                    style = typography.label,
                    color = if (isDestructive) colors.danger else colors.brand,
                )
            }
        },
        modifier = modifier,
        dismissButton = {
            TextButton(onClick = onDismissRequest) {
                Text(text = cancelLabel, style = typography.label, color = colors.textSecondary)
            }
        },
        title = {
            Text(text = title, style = typography.title3, color = colors.textPrimary)
        },
        text = {
            if (message != null) {
                Text(text = message, style = typography.callout, color = colors.textSecondary)
            }
        },
        shape = LKShapes.lg,
        containerColor = colors.bgElevated,
        titleContentColor = colors.textPrimary,
        textContentColor = colors.textSecondary,
    )
}
