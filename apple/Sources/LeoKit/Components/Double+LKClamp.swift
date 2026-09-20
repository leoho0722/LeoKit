//
//  Double+LKClamp.swift
//  LeoKit
//
//  Created by Leo Ho on 2026/09/20.
//

// MARK: - LKClamp

extension Double {

    /// 把值夾在 0 到 1 之間，超出範圍的進度不會畫出超過軌道的長度
    var clampedToUnitRange: Double {
        min(max(self, 0), 1)
    }
}
