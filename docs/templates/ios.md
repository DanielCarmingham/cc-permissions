# ios

Xcode, Swift, CocoaPods, and iOS development

**Category:** Mobile Development

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `xcodebuild -version` | Check Xcode version |
| `xcodebuild -showsdks` | List available SDKs |
| `xcodebuild -list` | List targets and schemes |
| `xcodebuild -showBuildSettings` | Show build settings |
| `swift --version` | Check Swift version |
| `swift -version` | Check Swift version |
| `swift package describe` | Describe Swift package |
| `swift package show-dependencies` | Show dependencies |
| `swift package dump-package` | Dump package manifest |
| `xcrun --version` | Check xcrun version |
| `xcrun --find` | Find Xcode tool |
| `xcrun --show-sdk-path` | Show SDK path |
| `xcrun --show-sdk-version` | Show SDK version |
| `xcrun simctl list` | List simulators |
| `xcrun simctl status_bar` | Get status bar info |
| `pod --version` | Check CocoaPods version |
| `pod env` | Show CocoaPods environment |
| `pod search` | Search for pods |
| `pod spec cat` | Show pod spec |
| `pod outdated` | List outdated pods |
| `pod list` | List all pods |
| `xcode-select --print-path` | Show Xcode path |
| `xcode-select --version` | Check xcode-select version |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `xcodebuild build` | Build project |
| `xcodebuild clean` | Clean build |
| `xcodebuild test` | Run tests |
| `xcodebuild analyze` | Analyze code |
| `xcodebuild build-for-testing` | Build for testing |
| `xcodebuild test-without-building` | Test without building |
| `swift build` | Build Swift package |
| `swift test` | Run Swift tests |
| `swift run` | Run Swift package |
| `swift package resolve` | Resolve dependencies |
| `swift package generate-xcodeproj` | Generate Xcode project |
| `xcrun simctl create` | Create simulator |
| `xcrun simctl delete` | Delete simulator |
| `xcrun simctl erase` | Erase simulator |
| `xcrun simctl launch` | Launch app in simulator |
| `xcrun simctl terminate` | Terminate app in simulator |
| `xcrun simctl openurl` | Open URL in simulator |
| `pod install --dry-run` | Dry-run pod install |
| `pod update --dry-run` | Dry-run pod update |
| `pod deintegrate` | Deintegrate pods |
| `swiftlint` | Run SwiftLint |
| `swiftlint lint` | Lint Swift code |
| `swiftlint autocorrect` | Auto-fix lint issues |
| `swiftformat` | Format Swift code |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `pod install` | Install pods |
| `pod update` | Update pods |
| `pod repo update` | Update pod repos |
| `pod cache clean` | Clean pod cache |
| `swift package update` | Update dependencies |
| `swift package clean` | Clean build artifacts |
| `swift package reset` | Reset package |
| `swift package init` | Initialize package |
| `xcodebuild archive` | Create archive |
| `xcodebuild -exportArchive` | Export archive |
| `xcrun simctl boot` | Boot simulator |
| `xcrun simctl shutdown` | Shutdown simulator |
| `xcrun simctl install` | Install app on simulator |
| `xcrun simctl uninstall` | Uninstall app from simulator |
| `carthage bootstrap` | Bootstrap Carthage |
| `carthage update` | Update Carthage deps |
| `carthage build` | Build Carthage deps |
