---
title: "Some Basic Rust to Get You Started"
date: "2024-11-01"
description: "Basic Rust to get you started with building backend in Rust"
---

After deciding to use Rust for backend development, the next step is understanding and getting familiar with its basic syntax and concepts. Let's break down the essential syntax and patterns you'll need to start building robust backend systems.

## Variables and Data Types: The Building Blocks

Rust's type system is one of its strongest features. Here's how variables and types work:

```rust
// Variables are immutable by default
let x = 5;
let mut y = 10; // Mutable variable

// Type annotations
let z: i32 = 15;
let f: f64 = 3.14;
let b: bool = true;
let c: char = 'c';
let s: String = String::from("hello");

// Constants
const MAX_POINTS: u32 = 100_000;
```

**Key Takeaway**: Rust's default immutability helps prevent bugs and makes concurrent code safer.

## Control Flow: Making Decisions

Control flow in Rust is expressive and powerful:

```rust
// If expressions (note: they return values!)
let number = 6;
let message = if number % 4 == 0 {
    "divisible by 4"
} else if number % 3 == 0 {
    "divisible by 3"
} else {
    "not divisible by 4 or 3"
};

// Loop expressions
let mut counter = 0;
let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2;
    }
};

// For loops are clean and safe
for element in 0..5 {
    println!("{}", element);
}
```

## The Ownership System: Rust's Secret Weapon

Understanding ownership is crucial for Rust development. Here's how it works:

```rust
fn ownership_example() {
    // Stack-allocated types are copied
    let x = 5;
    let y = x; // Copy
    println!("x: {}, y: {}", x, y); // Both accessible

    // Heap-allocated types are moved
    let s1 = String::from("hello");
    let s2 = s1; // Move
    // println!("{}", s1); // Would not compile - value moved

    // References let us borrow values
    let s3 = String::from("hello");
    let len = calculate_length(&s3); // Borrow
    println!("Length of '{}' is {}", s3, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

## Project Management with Cargo

Every Rust project follows a standard structure:

```plaintext
my_project/
├── Cargo.toml
├── Cargo.lock
└── src/
    └── main.rs
    └── lib.rs
```

### Cargo.toml: Your Project's Blueprint

```toml
[package]
name = "my_project"
version = "0.1.0"
edition = "2021"
authors = ["Your Name <you@example.com>"]
description = "A sample Rust project"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }

[dev-dependencies]
criterion = "0.5"
```

## Essential Cargo Commands

Here are the commands you'll use daily:

```bash
# Create new project
cargo new my_project
cargo new --lib my_library

# Build
cargo build            # Debug build
cargo build --release  # Release build

# Run
cargo run
cargo run --release

# Test
cargo test
cargo test --test integration_test

# Check compilation
cargo check

# Update dependencies
cargo update
cargo update -p serde  # Update specific package

# Documentation
cargo doc --open

# Publish to crates.io
cargo publish
```

## Dependency Management Best Practices

When specifying dependencies, be explicit about versions:

```toml
# Exact version
rand = "=0.8.5"

# Compatible updates
serde = "~1.0.152"  # Only patch updates
tokio = "^1.0.0"    # Minor and patch updates

# Feature selection
serde = { version = "1.0", features = ["derive"] }
```

## Working with Workspaces

For larger projects, workspaces help organize your code:

```toml
[workspace]
members = [
    "core",
    "api",
    "models"
]
```

## What's Next?

Now that we've covered the fundamentals, my next blog will focus on building a REST API using these concepts. We'll see how Rust's ownership system and type safety create robust, high-performance backend services.

## Additional Resources

- [The Rust Book](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rust Cookbook](https://rust-lang-nursery.github.io/rust-cookbook/)
- [Asynchronous Programming in Rust](https://rust-lang.github.io/async-book/)

_Stay tuned for my next blog where we'll build our first REST API in Rust!_