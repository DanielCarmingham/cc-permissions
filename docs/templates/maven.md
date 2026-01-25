# maven

Apache Maven build tool

**Category:** Build Tools

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mvn --version` | Check Maven version |
| `mvn -v` | Check Maven version |
| `mvn help:effective-pom` | Show effective POM |
| `mvn help:effective-settings` | Show effective settings |
| `mvn help:describe` | Describe plugin goals |
| `mvn help:system` | Show system properties |
| `mvn dependency:tree` | Show dependency tree |
| `mvn dependency:list` | List dependencies |
| `mvn dependency:analyze` | Analyze dependencies |
| `mvn versions:display-dependency-updates` | Show dependency updates |
| `mvn versions:display-plugin-updates` | Show plugin updates |
| `./mvnw --version` | Check wrapper version |
| `./mvnw -v` | Check wrapper version |
| `./mvnw help:effective-pom` | Show effective POM |
| `./mvnw dependency:tree` | Show dependency tree |

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
| `./mvnw compile` | Compile sources |
| `./mvnw test` | Run tests |
| `./mvnw package` | Package project |
| `./mvnw verify` | Verify project |

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
| `mvn dependency:copy-dependencies` | Copy dependencies |
| `./mvnw install` | Install to local repo |
| `./mvnw clean` | Clean project |
| `./mvnw deploy` | Deploy to remote repo |
