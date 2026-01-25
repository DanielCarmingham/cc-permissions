# android

Android SDK, ADB, and emulator

**Category:** Mobile Development

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `adb version` | Check ADB version |
| `adb devices` | List connected devices |
| `adb get-state` | Get device state |
| `adb get-serialno` | Get device serial |
| `adb shell getprop` | Get device properties |
| `adb shell pm list packages` | List installed packages |
| `adb shell dumpsys` | Dump system info |
| `emulator -list-avds` | List AVDs |
| `emulator -version` | Check emulator version |
| `sdkmanager --list` | List SDK packages |
| `sdkmanager --version` | Check SDK manager version |
| `studio --version` | Check Android Studio version |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `gradle assembleDebug` | Build debug APK |
| `./gradlew assembleDebug` | Build debug APK |
| `gradle bundleDebug` | Build debug AAB |
| `./gradlew bundleDebug` | Build debug AAB |
| `gradle installDebug` | Install debug APK |
| `./gradlew installDebug` | Install debug APK |
| `gradle testDebugUnitTest` | Run debug unit tests |
| `./gradlew testDebugUnitTest` | Run debug unit tests |
| `gradle connectedAndroidTest` | Run instrumented tests |
| `./gradlew connectedAndroidTest` | Run instrumented tests |
| `gradle connectedDebugAndroidTest` | Run debug instrumented tests |
| `./gradlew connectedDebugAndroidTest` | Run debug instrumented tests |
| `gradle lint` | Run lint |
| `./gradlew lint` | Run lint |
| `gradle lintDebug` | Lint debug build |
| `./gradlew lintDebug` | Lint debug build |
| `adb logcat` | View device logs |
| `adb bugreport` | Capture bug report |
| `adb shell screencap` | Take screenshot |
| `adb shell screenrecord` | Record screen |
| `adb shell am` | Activity manager commands |
| `adb shell pm path` | Get package path |
| `emulator @` | Start emulator |
| `emulator -avd` | Start specific AVD |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `gradle assembleRelease` | Build release APK |
| `./gradlew assembleRelease` | Build release APK |
| `gradle bundleRelease` | Build release AAB |
| `./gradlew bundleRelease` | Build release AAB |
| `gradle installRelease` | Install release APK |
| `./gradlew installRelease` | Install release APK |
| `gradle signingReport` | Show signing info |
| `./gradlew signingReport` | Show signing info |
| `adb install` | Install APK |
| `adb uninstall` | Uninstall app |
| `adb push` | Push file to device |
| `adb pull` | Pull file from device |
| `adb shell pm clear` | Clear app data |
| `adb shell settings put` | Change settings |
| `sdkmanager` | Manage SDK packages |
| `sdkmanager --install` | Install SDK package |
| `sdkmanager --uninstall` | Uninstall SDK package |
| `sdkmanager --update` | Update SDK packages |
| `avdmanager create` | Create AVD |
| `avdmanager delete` | Delete AVD |
| `adb reboot` | Reboot device |
| `adb root` | Restart ADB as root |
