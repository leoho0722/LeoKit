package io.github.leoho0722.leokit.components

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.addPathNodes
import androidx.compose.ui.unit.dp

/**
 * 介面內部用的功能性字形。
 *
 * 這不是 LeoKit 的圖示集 —— 產品圖示請用 Material Symbols（Rounded、weight 400）。
 * 這裡只放元件自己需要的幾個形狀，讓函式庫不必相依整包圖示。
 * 描邊固定黑色，實際顏色由 Icon 的 tint 決定。
 */
public object LKIcons {
    /** 往右的箭頭，表示點下去會換頁。 */
    public val Chevron: ImageVector = build("Chevron", "M9 6l6 6-6 6")

    /** 勾號，表示已選取或已完成。 */
    public val Check: ImageVector = build("Check", "M20 6L9 17l-5-5")

    /** 加號，表示新增一筆。 */
    public val Plus: ImageVector = build("Plus", "M12 5v14M5 12h14")

    /** 叉叉，表示關閉或移除。 */
    public val Close: ImageVector = build("Close", "M18 6L6 18M6 6l12 12")

    /** 三角形警告號，用於錯誤與需要注意的狀況。 */
    public val Alert: ImageVector = build(
        "Alert",
        "M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0",
    )

    /** 圓框裡的 i，用於補充說明。 */
    public val Info: ImageVector = build("Info", "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 11v6M12 7.5h.01")

    /** 時鐘，用於時間與即將到期。 */
    public val Clock: ImageVector = build("Clock", "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2")

    /** 減號，用於 stepper 的減少鈕與部分勾選的方框。 */
    public val Minus: ImageVector = build("Minus", "M5 12h14")

    /** 向下的箭頭，用於會展開選擇面的欄位。 */
    public val ChevronDown: ImageVector = build("ChevronDown", "M6 9l6 6 6-6")

    /** 日曆，用於選日期的欄位。 */
    public val Calendar: ImageVector = build(
        "Calendar",
        "M7 3v4M17 3v4M4 9.5h16M5.5 5h13a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-13"
            + "A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5z",
    )

    /** 放大鏡，用於搜尋欄位。 */
    public val Search: ImageVector = build("Search", "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4")

    /** 人形，用於沒有圖片也沒有名字的頭像。 */
    public val User: ImageVector = build("User", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4.5 21a7.5 7.5 0 0 1 15 0")

    /** 燈泡，用於功能發現提示。 */
    public val Lightbulb: ImageVector = build(
        "Lightbulb",
        "M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.4.3.6.8.6 1.2v1h6v-1c0-.4.2-.9.6-1.2A6 6 0 0 0 12 3",
    )

    /**
     * 把一段 SVG 路徑做成 24dp 的描邊字形。
     *
     * @param name 這個字形的名稱，只用於除錯與預覽工具
     * @param pathData SVG 的 path 資料，以 24×24 的畫布為基準
     * @return 可以交給 Icon 使用的 [ImageVector]；描邊固定黑色，實際顏色由 tint 決定
     */
    private fun build(name: String, pathData: String): ImageVector =
        ImageVector.Builder(
            name = name,
            defaultWidth = 24.dp,
            defaultHeight = 24.dp,
            viewportWidth = 24f,
            viewportHeight = 24f,
        ).apply {
            addPath(
                pathData = addPathNodes(pathData),
                stroke = SolidColor(Color.Black),
                strokeLineWidth = 1.8f,
                strokeLineCap = StrokeCap.Round,
                strokeLineJoin = StrokeJoin.Round,
            )
        }.build()
}
