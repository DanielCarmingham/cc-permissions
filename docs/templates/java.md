# java

Java and JVM runtime

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `java --version` | Check Java version |
| `java -version` | Check Java version |
| `javac --version` | Check javac version |
| `javac -version` | Check javac version |
| `jar --version` | Check jar tool version |
| `jshell --version` | Check JShell version |
| `jps` | List Java processes |
| `jinfo` | Show JVM configuration |
| `jstat` | Show JVM statistics |
| `jstack` | Print thread dump |
| `jmap -histo` | Show heap histogram |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `javac` | Compile Java sources |
| `java -jar` | Run JAR file |
| `java -cp` | Run with classpath |
| `java -classpath` | Run with classpath |
| `java -m` | Run module |
| `java --module` | Run module |
| `jar cf` | Create JAR file |
| `jar tf` | List JAR contents |
| `jar xf` | Extract JAR contents |
| `jshell` | Start JShell REPL |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `java` | Run Java application |
| `javadoc` | Generate documentation |
| `jlink` | Create custom runtime image |
| `jpackage` | Create native installer |
| `jmap -dump` | Create heap dump |
