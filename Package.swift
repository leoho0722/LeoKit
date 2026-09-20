// swift-tools-version: 6.2
//
// LeoKit — 一份語意 token 來源，三種原生實作。
//
// SwiftPM 不支援從 git URL 解析子目錄裡的套件，所以 manifest 必須放在 repo 根目錄；
// 實際的原始碼仍然收在 apple/ 底下，與 android/ 和 web/ 平行。
//
// 消費端：
//   .package(url: "https://github.com/leoho0722/LeoKit.git", from: "0.1.0")
//
// GitHub Packages 沒有 Swift registry，Swift 套件是靠 git tag 發佈的。

import PackageDescription

let package = Package(
    name: "LeoKit",
    platforms: [
        .iOS("26.0"),
    ],
    products: [
        .library(name: "LeoKit", targets: ["LeoKit"]),
    ],
    targets: [
        .target(
            name: "LeoKit",
            path: "apple/Sources/LeoKit",
            swiftSettings: [
                .swiftLanguageMode(.v6),
            ]
        ),
        .testTarget(
            name: "LeoKitTests",
            dependencies: ["LeoKit"],
            path: "apple/Tests/LeoKitTests"
        ),
    ]
)
