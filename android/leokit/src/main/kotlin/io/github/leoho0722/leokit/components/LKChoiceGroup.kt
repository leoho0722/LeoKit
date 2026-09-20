package io.github.leoho0722.leokit.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import io.github.leoho0722.leokit.tokens.LKSpacing

/**
 * [LKCheckbox] 或 [LKRadio] 的群組容器。
 *
 * 單選群組一定要包在這裡：`selectableGroup()` 是「整組只佔一個焦點停留點、進入後用方向鍵移動」
 * 這個行為的來源，少了它每個選項都會各自成為一個停留點，那是多選才該有的行為。
 *
 * @param label 說明這一組在選什麼，唸給螢幕閱讀器聽
 * @param modifier 由呼叫端套在整組上的修飾子
 * @param singleChoice 這組是否為單選；true 時套用 `selectableGroup()` 語意
 * @param content 這一組裡的選項，由上而下排列
 */
@Composable
public fun LKChoiceGroup(
    label: String,
    modifier: Modifier = Modifier,
    singleChoice: Boolean = false,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier
            .then(if (singleChoice) Modifier.selectableGroup() else Modifier)
            .semantics { contentDescription = label },
        verticalArrangement = Arrangement.spacedBy(LKSpacing.spacing4),
        content = content,
    )
}
