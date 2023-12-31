CREATE DATABASE IF NOT EXISTS db;

CREATE TABLE user
(
    id INT PRIMARY KEY NOT NULL,
    name VARCHAR(100)
);

CREATE TABLE user_groceries
(
    id INT PRIMARY KEY NOT NULL,
    user_id VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
