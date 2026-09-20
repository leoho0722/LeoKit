// swift-tools-version: 6.2

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
