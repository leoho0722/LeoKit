package io.github.leoho0722.leokit.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.SearchBar
import androidx.compose.material3.SearchBarDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import io.github.leoho0722.leokit.LKTheme
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * 可以打字過濾的選擇清單。
 *
 * 行動端刻意不做下拉面板：小螢幕上的下拉選項很難按。這裡用展開的 `SearchBar`。
 * 入口請用 [LKPickerField]，把這個放進展開的搜尋畫面。
 * 過濾在元件內做；非同步搜尋時由呼叫端替換 [options] 並自行處理載入狀態。
 * 選了就關閉，所以 [onSelect] 之後由呼叫端負責收掉搜尋畫面。
 *
 * @param query 搜尋框裡目前打的字
 * @param onQueryChange 使用者打字時呼叫，參數是新的字串
 * @param options 全部可選的選項
 * @param onSelect 使用者選了某一項時呼叫，參數是那一項的值
 * @param modifier 由呼叫端套在整個搜尋畫面上的修飾子
 * @param placeholder 搜尋框的提示文字
 * @param emptyText 一個選項都沒有符合時顯示的一行字
 * @param expanded 搜尋畫面目前是否展開
 * @param onExpandedChange 展開狀態改變時呼叫
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
public fun LKCombobox(
    query: String,
    onQueryChange: (String) -> Unit,
    options: List<LKComboboxOption>,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "搜尋",
    emptyText: String = "沒有符合的選項",
    expanded: Boolean = true,
    onExpandedChange: (Boolean) -> Unit = {},
) {
    val colors = LKTheme.colors
    val typography = LKTheme.typography
    val matches = options.filter { query.isBlank() || it.label.contains(query, ignoreCase = true) }

    SearchBar(
        inputField = {
            SearchBarDefaults.InputField(
                query = query,
                onQueryChange = onQueryChange,
                onSearch = { onExpandedChange(false) },
                expanded = expanded,
                onExpandedChange = onExpandedChange,
                placeholder = { Text(text = placeholder, style = typography.body) },
            )
        },
        expanded = expanded,
        onExpandedChange = onExpandedChange,
        modifier = modifier,
        colors = SearchBarDefaults.colors(containerColor = colors.bgSurface),
    ) {
        if (matches.isEmpty()) {
            LKEmptyState(title = emptyText, icon = LKIcons.Search, compact = true)
            return@SearchBar
        }
        LazyColumn {
            items(matches) { option ->
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSelect(option.value) }
                        .padding(
                            horizontal = LKSpacing.spacing16,
                            vertical = LKSpacing.spacing12,
                        ),
                ) {
                    Text(text = option.label, style = typography.body, color = colors.textPrimary)
                }
            }
        }
    }
}

/** 可搜尋清單裡的一個選項。 */
public data class LKComboboxOption(
    /** 顯示給使用者看的文字，也是搜尋比對的對象。 */
    public val label: String,
    /** 這個選項代表的值。 */
    public val value: String,
)
