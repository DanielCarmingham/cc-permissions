# gradle

Gradle build tool and wrapper

**Category:** Build Tools

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `gradle --version` | Check Gradle version |
| `gradle -v` | Check Gradle version |
| `gradle tasks` | List available tasks |
| `gradle dependencies` | Show dependency tree |
| `gradle projects` | List projects |
| `gradle properties` | Show project properties |
| `gradle help` | Show help |
| `gradle --status` | Show daemon status |
| `./gradlew --version` | Check wrapper version |
| `./gradlew -v` | Check wrapper version |
| `./gradlew tasks` | List available tasks |
| `./gradlew dependencies` | Show dependency tree |
| `./gradlew projects` | List projects |
| `./gradlew properties` | Show project properties |
| `./gradlew help` | Show help |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `gradle build` | Build project |
| `gradle assemble` | Assemble outputs |
| `gradle test` | Run tests |
| `gradle check` | Run all checks |
| `gradle classes` | Compile classes |
| `gradle testClasses` | Compile test classes |
| `gradle jar` | Create JAR |
| `gradle compileJava` | Compile Java sources |
| `gradle compileKotlin` | Compile Kotlin sources |
| `./gradlew build` | Build project |
| `./gradlew assemble` | Assemble outputs |
| `./gradlew test` | Run tests |
| `./gradlew check` | Run all checks |
| `./gradlew classes` | Compile classes |
| `./gradlew testClasses` | Compile test classes |
| `./gradlew jar` | Create JAR |
| `./gradlew compileJava` | Compile Java sources |
| `./gradlew compileKotlin` | Compile Kotlin sources |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `gradle publish` | Publish artifacts |
| `gradle publishToMavenLocal` | Publish to local Maven |
| `gradle clean` | Clean build outputs |
| `gradle wrapper` | Generate Gradle wrapper |
| `gradle init` | Initialize new project |
| `gradle --stop` | Stop Gradle daemon |
| `./gradlew publish` | Publish artifacts |
| `./gradlew publishToMavenLocal` | Publish to local Maven |
| `./gradlew clean` | Clean build outputs |
