# LeoKit 的開發容器
#
# 三套工具鏈都從官方 image 取，用 multi-stage 合起來；只有 Android SDK 需要自己裝。
#
# Web 與 Android 的編譯、測試都在這裡跑。
# Apple 的套件用 SwiftUI 且只支援 iOS 26，無法在 Linux 編譯 ——
# 這裡只做 Package.swift 的 manifest 驗證與 Swift 語法檢查，真正的編譯要在 macOS + Xcode。

FROM node:26-bookworm AS node
FROM eclipse-temurin:21-jdk-noble AS jdk

# Swift 的官方 image 當最終 base。
# 它本身就是 Ubuntu 24.04，而且已經裝好 Swift 的 runtime 相依
# （libcurl4、libxml2、libpython3、libsqlite3-0、libedit2、libncurses、libz3 …），
# 這些是 Foundation、sourcekit-lsp、REPL 需要的，自己裝很容易漏。
FROM swift:6.4.0-noble

# 下面的 RUN 有 pipe（yes | sdkmanager），沒有 pipefail 的話 sdkmanager 失敗會被 yes 的結束碼蓋掉
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG ANDROID_CMDLINE_TOOLS=13114758
ARG ANDROID_PLATFORM=android-37.2
ARG ANDROID_BUILD_TOOLS=37.0.0-rc2

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# ---- Node：官方 image 的 node 是自足的（不靠 apt 相依），整包搬過來 ----
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
 && ln -sf /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
 && node --version && npm --version

# ---- JDK：temurin 整包放在 /opt/java/openjdk ----
COPY --from=jdk /opt/java/openjdk /opt/java/openjdk
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH=${JAVA_HOME}/bin:${PATH}
RUN java -version

# ---- Android SDK：Google 沒有官方 image，只能用 sdkmanager ----
# 這段是在容器內實際跑過並成功 build 出 AAR 的組合。
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=${ANDROID_HOME}
# 不釘 apt 版本：這是開發容器，釘了只會在上游移除舊版時讓 rebuild 壞掉
# hadolint ignore=DL3008
RUN apt-get update \
 && apt-get install -y --no-install-recommends unzip \
 && rm -rf /var/lib/apt/lists/* \
 && mkdir -p ${ANDROID_HOME}/cmdline-tools \
 && curl -fsSL -o /tmp/clt.zip \
      "https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_CMDLINE_TOOLS}_latest.zip" \
 && unzip -q /tmp/clt.zip -d ${ANDROID_HOME}/cmdline-tools \
 && mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest \
 && rm /tmp/clt.zip \
 && yes | ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager --licenses > /dev/null \
 && ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager \
      "platform-tools" "platforms;${ANDROID_PLATFORM}" "build-tools;${ANDROID_BUILD_TOOLS}" > /dev/null \
 # 非 root 的 devcontainer 使用者也要能讀寫（Gradle 會在這裡寫 license 與快取）
 && chmod -R a+rwX ${ANDROID_HOME}
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools
