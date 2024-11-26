---
title: "Building a REST API with Rust"
date: "2024-11-02"
description: "Learn how to build a REST API using Rust and Actix-web"
---

In this post, we'll build a simple REST API using Rust and Actix-web. This API will allow us to create, read, update, and delete blog posts. Let's dive into the code and see how it all works.

## Setting Up the Project

First, let's create a new Rust project and set up our dependencies. We'll use Actix-web for the web server, Serde for JSON serialization, and UUID for unique identifiers.

### Cargo.toml

```toml
[package]
name = "blog_api"
version = "0.1.0"
edition = "2021"

[dependencies]
actix-web = "4.4"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
uuid = { version = "1.6", features = ["serde", "v4"] }
chrono = { version = "0.4", features = ["serde"] }
thiserror = "1.0"
parking_lot = "0.12"
log = "0.4"
env_logger = "0.11.5"
```



## Defining Models

We'll define our data models in `src/models.rs`. These models represent the structure of our blog posts.



```rust
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Clone)]
pub struct BlogPost {
    pub id: Uuid,
    pub title: String,
    pub content: String,
    pub author: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateBlogPost {
    pub title: String,
    pub content: String,
    pub author: String,
}
#[derive(Debug, Deserialize)]
pub struct UpdateBlogPost {
    pub title: Option<String>,
    pub content: Option<String>,
}
```


So, let's break down what's happening in this code. We're defining three main structures: `BlogPost`, `CreateBlogPost`, and `UpdateBlogPost`.

First, we have the `BlogPost` structure. This represents a single blog post, and it has several fields: `id`, `title`, `content`, `author`, `created_at`, and `updated_at`. The `id` field is a unique identifier for the blog post, and it's represented by a `Uuid` type. The `title` and `content` fields are strings that hold the title and content of the blog post, respectively. The `author` field is also a string that represents the author of the blog post. The `created_at` and `updated_at` fields are timestamps that represent when the blog post was created and last updated, respectively.

Next, we have the `CreateBlogPost` structure. This represents the data that's required to create a new blog post. It has three fields: `title`, `content`, and `author`. These fields are all strings, and they represent the title, content, and author of the new blog post, respectively.

Finally, we have the `UpdateBlogPost` structure. This represents the data that's required to update an existing blog post. It has two fields: `title` and `content`. These fields are both optional, which means that they can be `None` if you don't want to update that particular field. This allows you to update just the title or just the content of a blog post, or both.

## Implementing the Store

The `Store` struct in `src/store.rs` is responsible for managing our blog posts in memory. It uses a `HashMap` to store the posts, where each post is identified by a unique `Uuid`.

The `Store` struct itself is cloneable, which means we can create multiple instances of it that share the same underlying data. This is achieved through the use of `std::sync::Arc` and `parking_lot::RwLock`, which allow for thread-safe sharing and modification of the data.

```rust
use std::collections::HashMap;
use parking_lot::RwLock;
use uuid::Uuid;
use chrono::Utc;
use crate::models::{BlogPost, CreateBlogPost, UpdateBlogPost};
#[derive(Clone)]
pub struct Store {
    posts: std::sync::Arc<RwLock<HashMap<Uuid, BlogPost>>>,
}

impl Store {
    pub fn new() -> Self {
        Store {
            posts: std::sync::Arc::new(RwLock::new(HashMap::new())),
        }
    }
    pub fn create_post(&self, post: CreateBlogPost) -> BlogPost {
        let id = Uuid::new_v4();
        let now = Utc::now();
        let blog_post = BlogPost {
            id,
            title: post.title,
            content: post.content,
            author: post.author,
            created_at: now,
            updated_at: now,
        };
        self.posts.write().insert(id, blog_post.clone());
        blog_post
    }
    pub fn get_post(&self, id: Uuid) -> Option<BlogPost> {
        self.posts.read().get(&id).cloned()
    }
    pub fn list_posts(&self) -> Vec<BlogPost> {
        self.posts.read().values().cloned().collect()
    }
    pub fn update_post(&self, id: Uuid, update: UpdateBlogPost) -> Option<BlogPost> {
        let mut posts = self.posts.write();
        if let Some(post) = posts.get_mut(&id) {
            if let Some(title) = update.title {
                post.title = title;
            }
            if let Some(content) = update.content {
                post.content = content;
            }
            post.updated_at = Utc::now();
            Some(post.clone())
        } else {
          None
        }
    }
    pub fn delete_post(&self, id: Uuid) -> bool {
        self.posts.write().remove(&id).is_some()
    }
}
```

The `create_post` method is used to add a new blog post to the store. It generates a new `Uuid` for the post, sets the current time as both the creation and update times, and inserts the post into the `HashMap`. The method returns the newly created post.

The `get_post` method retrieves a blog post by its `Uuid`. It locks the `HashMap` for reading and returns a clone of the post if it exists, or `None` if it doesn't.

The `list_posts` method returns a vector of all blog posts in the store. It locks the `HashMap` for reading and collects all values into a vector.

The `update_post` method updates an existing blog post. It locks the `HashMap` for writing and finds the post by its `Uuid`. If the post exists, it updates the title and content if new values are provided, and sets the update time to the current time. The method returns a clone of the updated post, or `None` if the post doesn't exist.

The `delete_post` method removes a blog post from the store by its `Uuid`. It locks the `HashMap` for writing and returns `true` if the post was found and removed, or `false` if it didn't exist.

## Creating Handlers

In `src/handlers.rs`, we define functions to handle HTTP requests for our API. These functions are designed to interact with the `Store` struct, which manages the blog posts in memory.

```rust
use actix_web::{web, HttpResponse, Responder};
use uuid::Uuid;
use log::{info, warn};
use crate::models::{CreateBlogPost, UpdateBlogPost};
use crate::store::Store;
 
pub async fn create_post(
    store: web::Data<Store>,
    post: web::Json<CreateBlogPost>,
) -> impl Responder {
    info!("Creating new post with title: {}", post.title);
    let post = store.create_post(post.into_inner());
    info!("Successfully created post with id: {}", post.id);
    HttpResponse::Created().json(post)
}
 
pub async fn get_post(
    store: web::Data<Store>,
    id: web::Path<Uuid>,
) -> impl Responder {
    let uuid = id;
    info!("Fetching post with id: {}", uuid);
    match store.get_post(*uuid) {
        Some(post) => {
            info!("Found post: {}", post.title);
            HttpResponse::Ok().json(post)
        }
        None => {
            warn!("Post not found with id: {}", uuid);
            HttpResponse::NotFound().finish()
        }
    }
}
 
pub async fn list_posts(store: web::Data<Store>) -> impl Responder {
    info!("Listing all posts");
    let posts = store.list_posts();
    info!("Retrieved {} posts", posts.len());
    HttpResponse::Ok().json(posts)
}
 
pub async fn update_post(
    store: web::Data<Store>,
    id: web::Path<Uuid>,
    update: web::Json<UpdateBlogPost>,
) -> impl Responder {
    let uuid = id;
    info!("Updating post with id: {}", uuid);
    match store.update_post(*uuid, update.into_inner()) {
        Some(post) => {
            info!("Successfully updated post: {}", post.title);
            HttpResponse::Ok().json(post)
        }
        None => {
            warn!("Failed to update - post not found with id: {}", uuid);
            HttpResponse::NotFound().finish()
        }
    }
}
 
pub async fn delete_post(
    store: web::Data<Store>,
    id: web::Path<Uuid>,
) -> impl Responder {
    let uuid = id;
    info!("Attempting to delete post with id: {}", uuid);
    if store.delete_post(*uuid) {
        info!("Successfully deleted post with id: {}", uuid);
        HttpResponse::NoContent().finish()
    } else {
        warn!("Failed to delete - post not found with id: {}", uuid);
        HttpResponse::NotFound().finish()
    }
}
```
The first function, `create_post`, is responsible for handling HTTP POST requests to create a new blog post. It takes two parameters: `store`, which is an instance of the `Store` struct, and `post`, which is a JSON object containing the details of the new blog post. The function logs the creation attempt, calls the `create_post` method of the `Store` to create the post, logs the success of the creation, and returns an HTTP response with the created post.

The `get_post` function handles HTTP GET requests to retrieve a specific blog post by its unique identifier (UUID). It takes two parameters: `store`, which is an instance of the `Store` struct, and `id`, which is the UUID of the post to retrieve. The function logs the retrieval attempt, calls the `get_post` method of the `Store` to retrieve the post, and returns an HTTP response with the post if found, or a 404 error if not found.

The `list_posts` function handles HTTP GET requests to list all blog posts. It takes one parameter: `store`, which is an instance of the `Store` struct. The function logs the listing attempt, calls the `list_posts` method of the `Store` to retrieve all posts, logs the success of the listing, and returns an HTTP response with the list of posts.

The `update_post` function handles HTTP PUT requests to update an existing blog post. It takes three parameters: `store`, which is an instance of the `Store` struct, `id`, which is the UUID of the post to update, and `update`, which is a JSON object containing the updates to the post. The function logs the update attempt, calls the `update_post` method of the `Store` to update the post, and returns an HTTP response with the updated post if successful, or a 404 error if the post is not found.

The `delete_post` function handles HTTP DELETE requests to remove a blog post. It takes two parameters: `store`, which is an instance of the `Store` struct, and `id`, which is the UUID of the post to delete. The function logs the deletion attempt, calls the `delete_post` method of the `Store` to delete the post, and returns an HTTP response indicating success or failure of the deletion.


## Setting Up the Server

In the `src/main.rs` file, we're setting up an Actix-web server and defining the routes for our API. Let's break it down step by step.

```rust
mod models;
mod store;
mod handlers;
use actix_web::{web, App, HttpServer};
use store::Store;
use handlers::{create_post, get_post, list_posts, update_post, delete_post};
use log::info;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let store = Store::new();
    info!("🚀 Server starting on http://127.0.0.1:8080");
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(store.clone()))
            .service(
                web::scope("/api")
                    .route("/posts", web::post().to(create_post))
                    .route("/posts", web::get().to(list_posts))
                    .route("/posts/{id}", web::get().to(get_post))
                    .route("/posts/{id}", web::put().to(update_post))
                    .route("/posts/{id}", web::delete().to(delete_post))
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
```

First, we import the necessary modules: `models`, `store`, and `handlers`, which contain the logic for our blog posts. We also import `actix_web` for building the web server, `store::Store` for managing our data, and `handlers` for handling HTTP requests. Additionally, we use `log::info` for logging information about the server.

The `#[actix_web::main]` attribute marks the `main` function as the entry point for our Actix-web application. This function is marked as `async` because it will be running asynchronously.

Inside the `main` function, we first initialize the environment logger with the default filter set to "info". This means that only log messages with an "info" level or higher will be displayed.

Next, we create a new instance of `Store`, which is responsible for managing our blog posts. We then log a message indicating that the server is starting on `http://127.0.0.1:8080`.

Now, we set up the HTTP server using `HttpServer::new`. The closure passed to `HttpServer::new` defines the configuration for our server. We create a new instance of `App`, which represents the application. We then add the `Store` instance as application data using `app_data`, so it can be accessed by our handlers.

The `service` method is used to define the routes for our API. We create a scope for all routes starting with `/api`. Within this scope, we define five routes:

* `/posts` with the HTTP POST method, which calls the `create_post` handler to create a new blog post.
* `/posts` with the HTTP GET method, which calls the `list_posts` handler to list all blog posts.
* `/posts/{id}` with the HTTP GET method, which calls the `get_post` handler to retrieve a specific blog post by its ID.
* `/posts/{id}` with the HTTP PUT method, which calls the `update_post` handler to update an existing blog post.
* `/posts/{id}` with the HTTP DELETE method, which calls the `delete_post` handler to delete a blog post.

Finally, we bind the server to `127.0.0.1:8080` and start it running asynchronously with `run().await`.

## Conclusion

Congratulations! You now have a solid foundation for a REST API that supports CRUD operations for blog posts. This is just the starting point for your Rust and Actix-web journey. I will be writing more posts about Rust and Actix-web in the future.

_Keep an eye out for more insightful Rust backend development tutorials!_