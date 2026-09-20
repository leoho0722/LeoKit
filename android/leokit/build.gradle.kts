plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.compose)
    `maven-publish`
}

android {
    namespace = "io.github.leoho0722.leokit"
    compileSdk = 37
    compileSdkMinor = 2

    defaultConfig {
        minSdk = 31
        consumerProguardFiles("consumer-rules.pro")
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }


    publishing {
        singleVariant("release") {
            withSourcesJar()
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
        // 函式庫的公開 API 一律明確標註，避免不小心外露內部型別
        // 註：AGP 9 內建的 Kotlin 支援沒有 KGP 的 explicitApi()，
        // 所以這個旗標會一併套用到測試原始碼，測試裡的宣告也要寫出 public。
        freeCompilerArgs.add("-Xexplicit-api=strict")
    }
}

dependencies {
    api(platform(libs.compose.bom))
    api(libs.compose.ui)
    api(libs.compose.foundation)
    api(libs.compose.material3)
    implementation(libs.androidx.core.ktx)
    compileOnly(libs.compose.ui.tooling.preview)
    debugImplementation(libs.compose.ui.tooling)

    testImplementation(libs.junit)
    testImplementation(platform(libs.compose.bom))
    testImplementation(libs.compose.ui)
}

publishing {
    publications {
        register<MavenPublication>("release") {
            groupId = providers.gradleProperty("GROUP").get()
            artifactId = "leokit"
            version = providers.gradleProperty("VERSION_NAME").get()

            afterEvaluate { from(components["release"]) }

            pom {
                name.set("LeoKit")
                description.set("LeoKit — 一份語意 token 來源，三種原生實作。這是 Android 端的實作層。")
                url.set("https://github.com/leoho0722/LeoKit")
                licenses {
                    license {
                        name.set("MIT License")
                        url.set("https://github.com/leoho0722/LeoKit/blob/main/LICENSE")
                    }
                }
                developers {
                    developer {
                        id.set("leoho0722")
                        name.set("Leo Ho")
                    }
                }
                scm {
                    url.set("https://github.com/leoho0722/LeoKit")
                    connection.set("scm:git:https://github.com/leoho0722/LeoKit.git")
                }
            }
        }
    }
    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/leoho0722/LeoKit")
            credentials {
                username = providers.gradleProperty("gpr.user").orElse(providers.environmentVariable("GITHUB_ACTOR")).orNull
                password = providers.gradleProperty("gpr.token").orElse(providers.environmentVariable("GITHUB_TOKEN")).orNull
            }
        }
    }
}
