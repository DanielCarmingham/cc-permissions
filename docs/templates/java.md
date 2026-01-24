# java

Maven, Gradle, Java, and JVM development

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `java --version` | Check Java version |
| `java -version` | Check Java version |
| `javac --version` | Check javac version |
| `javac -version` | Check javac version |
| `mvn --version` | Check Maven version |
| `mvn -v` | Check Maven version |
| `mvn help:effective-pom` | Show effective POM |
| `mvn help:effective-settings` | Show effective settings |
| `mvn dependency:tree` | Show dependency tree |
| `mvn dependency:list` | List dependencies |
| `mvn dependency:analyze` | Analyze dependencies |
| `mvn versions:display-dependency-updates` | Show dependency updates |
| `mvn versions:display-plugin-updates` | Show plugin updates |
| `gradle --version` | Check Gradle version |
| `gradle -v` | Check Gradle version |
| `gradle tasks` | List Gradle tasks |
| `gradle dependencies` | Show Gradle dependencies |
| `gradle projects` | List Gradle projects |
| `gradle properties` | Show project properties |
| `./gradlew --version` | Check Gradle wrapper version |
| `./gradlew tasks` | List Gradle wrapper tasks |
| `./gradlew dependencies` | Show Gradle wrapper dependencies |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mvn compile` | Compile sources |
| `mvn test-compile` | Compile test sources |
| `mvn test` | Run tests |
| `mvn package` | Package project |
| `mvn verify` | Verify project |
| `mvn validate` | Validate project |
| `mvn site` | Generate site |
| `mvn checkstyle:check` | Run checkstyle |
| `mvn spotbugs:check` | Run SpotBugs |
| `mvn pmd:check` | Run PMD |
| `mvn jacoco:report` | Generate coverage report |
| `gradle build` | Build project |
| `gradle assemble` | Assemble outputs |
| `gradle test` | Run tests |
| `gradle check` | Run all checks |
| `gradle classes` | Compile classes |
| `gradle testClasses` | Compile test classes |
| `gradle jar` | Create JAR |
| `./gradlew build` | Build with wrapper |
| `./gradlew test` | Test with wrapper |
| `./gradlew assemble` | Assemble with wrapper |
| `./gradlew check` | Check with wrapper |
| `java -jar` | Run JAR file |
| `java -cp` | Run with classpath |
| `java -classpath` | Run with classpath |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mvn install` | Install to local repo |
| `mvn deploy` | Deploy to remote repo |
| `mvn clean` | Clean project |
| `mvn clean install` | Clean and install |
| `mvn clean package` | Clean and package |
| `mvn release:prepare` | Prepare release |
| `mvn release:perform` | Perform release |
| `mvn dependency:resolve` | Resolve dependencies |
| `mvn dependency:purge-local-repository` | Purge local repo |
| `gradle publish` | Publish artifacts |
| `gradle publishToMavenLocal` | Publish to local Maven |
| `gradle clean` | Clean project |
| `gradle wrapper` | Generate Gradle wrapper |
| `./gradlew clean` | Clean with wrapper |
| `./gradlew publish` | Publish with wrapper |
| `./gradlew publishToMavenLocal` | Publish to local Maven with wrapper |
