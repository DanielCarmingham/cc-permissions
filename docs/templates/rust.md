# rust

Cargo, rustc, and rustup

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `rustc --version` | Check rustc version |
| `rustc -V` | Check rustc version |
| `rustc --print` | Print compiler info |
| `cargo --version` | Check Cargo version |
| `cargo -V` | Check Cargo version |
| `cargo version` | Check Cargo version |
| `cargo help` | Cargo help |
| `cargo tree` | Show dependency tree |
| `cargo metadata` | Show package metadata |
| `cargo search` | Search crates.io |
| `cargo locate-project` | Locate Cargo.toml |
| `cargo read-manifest` | Read package manifest |
| `cargo pkgid` | Show package ID |
| `cargo audit` | Audit dependencies |
| `cargo outdated` | Check outdated dependencies |
| `cargo deny check` | Check dependency policies |
| `rustup --version` | Check rustup version |
| `rustup show` | Show installed toolchains |
| `rustup which` | Show which binary will run |
| `rustup target list` | List available targets |
| `rustup component list` | List available components |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `cargo build` | Build package |
| `cargo build --release` | Build release |
| `cargo build --target` | Build for target |
| `cargo check` | Check package |
| `cargo check --all-targets` | Check all targets |
| `cargo test` | Run tests |
| `cargo test --release` | Run release tests |
| `cargo test --doc` | Run doc tests |
| `cargo bench` | Run benchmarks |
| `cargo run` | Run package |
| `cargo run --release` | Run release build |
| `cargo run --example` | Run example |
| `cargo fmt` | Format code |
| `cargo fmt --check` | Check formatting |
| `cargo clippy` | Run Clippy linter |
| `cargo clippy --fix` | Apply Clippy fixes |
| `cargo doc` | Build documentation |
| `cargo doc --open` | Build and open docs |
| `cargo fix` | Apply compiler fixes |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `cargo install` | Install binary |
| `cargo uninstall` | Uninstall binary |
| `cargo publish` | Publish to crates.io |
| `cargo package` | Package crate |
| `cargo yank` | Yank published version |
| `cargo update` | Update dependencies |
| `cargo add` | Add dependency |
| `cargo remove` | Remove dependency |
| `cargo clean` | Clean target directory |
| `cargo vendor` | Vendor dependencies |
| `cargo new` | Create new package |
| `cargo init` | Initialize package |
| `rustup update` | Update toolchains |
| `rustup default` | Set default toolchain |
| `rustup toolchain install` | Install toolchain |
| `rustup toolchain uninstall` | Uninstall toolchain |
| `rustup target add` | Add target |
| `rustup target remove` | Remove target |
| `rustup component add` | Add component |
| `rustup component remove` | Remove component |
