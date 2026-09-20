package io.github.leoho0722.leokit.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 多欄、可以上下比較的資料。
 *
 * Material 沒有表格元件，所以這是自繪的 `LazyColumn`。
 * 表格是寬版面的元件：手機上請改用 [LKListRow] 一列一筆，只有平板才擺多欄。
 * 排序、分頁與篩選的邏輯都在呼叫端，這個元件只負責畫。
 * 數字欄靠右並用等寬數字，讓位數上下對齊。
 *
 * @param caption 這張表在說什麼，唸給螢幕閱讀器聽
 * @param columns 每一欄的定義，順序就是顯示順序
 * @param rows 每一列的資料，鍵對應 [LKTableColumn.key]
 * @param modifier 由呼叫端套在整張表上的修飾子
 */
@Composable
public fun LKTable(
    caption: String,
    columns: List<LKTableColumn>,
    rows: List<LKTableRow>,
    modifier: Modifier = Modifier,
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(colors.bgSurface)
            .semantics { contentDescription = caption },
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = LKSpacing.spacing16, vertical = LKSpacing.spacing8),
            horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing12),
        ) {
            columns.forEach { column ->
                Text(
                    text = column.label,
                    style = typography.subhead,
                    color = colors.textSecondary,
                    textAlign = if (column.numeric) TextAlign.End else TextAlign.Start,
                    modifier = Modifier.weight(1f),
                )
            }
        }
        LazyColumn {
            items(rows) { row ->
                HorizontalDivider(color = colors.borderSubtle)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(
                            horizontal = LKSpacing.spacing16,
                            vertical = LKSpacing.spacing12,
                        ),
                    horizontalArrangement = Arrangement.spacedBy(LKSpacing.spacing12),
                ) {
                    columns.forEach { column ->
                        Text(
                            text = row.cells[column.key].orEmpty(),
                            style = typography.callout,
                            color = colors.textPrimary,
                            textAlign = if (column.numeric) TextAlign.End else TextAlign.Start,
                            modifier = Modifier.weight(1f),
                        )
                    }
                }
            }
        }
    }
}

/** 表格的一欄：它的標題、對應到哪個鍵，以及要不要靠右對齊。 */
public data class LKTableColumn(
    /** 這一欄對應 [LKTableRow.cells] 裡的哪個鍵。 */
    public val key: String,
    /** 欄位標題。 */
    public val label: String,
    /** 是否為數字欄；數字欄靠右，方便上下比較位數。 */
    public val numeric: Boolean = false,
)

/** 表格的一列：每一欄的鍵對到那一格要顯示的文字。 */
public data class LKTableRow(
    /** 鍵對應 [LKTableColumn.key]，值是那一格的文字。 */
    public val cells: Map<String, String>,
)
