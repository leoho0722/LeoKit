//
//  LKCombobox.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

import SwiftUI

/// 可以打字過濾的選擇清單
///
/// - Note: 行動端刻意不做下拉面板：小螢幕上的下拉選項很難按。這裡是全螢幕的可搜尋清單
/// - Note: 入口請用 `LKPickerField`，把這個清單放進 `.sheet` 或推進 `NavigationStack`
/// - Note: 過濾在元件內做；非同步搜尋時由呼叫端替換 `options` 並自行處理載入狀態
/// - Note: 選了就關閉，所以 `onSelect` 之後由呼叫端負責收掉這個畫面
public struct LKCombobox<Value: Hashable & Sendable>: View {

    // MARK: - Properties

    /// 一個選項都沒有符合時顯示的一行字
    private let emptyMessage: String

    /// 使用者選了某一項時呼叫
    private let onSelect: (Value) -> Void

    /// 全部可選的選項
    private let options: [LKComboboxOption<Value>]

    /// 搜尋框裡目前打的字
    @State private var query = ""

    /// 這份清單在選什麼，同時是導覽列標題
    private let title: String

    // MARK: - Init

    /// 建立一份可搜尋的選擇清單
    ///
    /// - Parameters:
    ///   - title: 這份清單在選什麼
    ///   - options: 全部可選的選項
    ///   - emptyMessage: 一個選項都沒有符合時顯示的一行字
    ///   - onSelect: 使用者選了某一項時呼叫
    public init(
        _ title: String,
        options: [LKComboboxOption<Value>],
        emptyMessage: String = "沒有符合的選項",
        onSelect: @escaping (Value) -> Void
    ) {
        self.title = title
        self.options = options
        self.emptyMessage = emptyMessage
        self.onSelect = onSelect
    }

    // MARK: - Body

    /// 一份可搜尋的清單；沒有符合的選項時顯示空狀態
    public var body: some View {
        List {
            ForEach(matches) { option in
                row(for: option)
            }
        }
        .overlay {
            emptyState
        }
        .searchable(text: $query, prompt: title)
        .navigationTitle(title)
    }
}

// MARK: - Private Views

private extension LKCombobox {

    /// 一個選項一列，整列可點
    ///
    /// - Parameter option: 要畫的選項
    /// - Returns: 可以點的一列
    func row(for option: LKComboboxOption<Value>) -> some View {
        Button {
            onSelect(option.value)
        } label: {
            Text(option.label)
                .frame(maxWidth: .infinity, alignment: .leading)
                .font(LKFont.body)
                .foregroundStyle(LKColor.textPrimary)
                .contentShape(.rect)
        }
        .buttonStyle(.plain)
    }

    /// 沒有符合的選項時蓋在清單上的空狀態
    @ViewBuilder
    var emptyState: some View {
        if matches.isEmpty {
            LKEmptyState(emptyMessage, systemImage: "magnifyingglass")
        }
    }
}

// MARK: - Computed Properties

private extension LKCombobox {

    /// 依目前打的字過濾後的選項；沒打字就是全部
    var matches: [LKComboboxOption<Value>] {
        let needle = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !needle.isEmpty else {
            return options
        }
        return options.filter { $0.label.localizedCaseInsensitiveContains(needle) }
    }
}

// MARK: - Preview

#Preview("選擇服務") {
    NavigationStack {
        LKCombobox(
            "選擇服務",
            options: [
                LKComboboxOption("Netflix", value: "netflix"),
                LKComboboxOption("Spotify", value: "spotify"),
                LKComboboxOption("Disney+", value: "disney"),
                LKComboboxOption("YouTube Premium", value: "youtube"),
            ]
        ) { _ in }
    }
}
