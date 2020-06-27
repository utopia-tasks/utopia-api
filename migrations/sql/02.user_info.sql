CREATE SCHEMA user_info;

CREATE TABLE user_info.user_login
(
    user_guid    text primary key,
    username     varchar unique,
    password     text,
    password_md5 text,
    created_at   timestamp,
    updated_at   timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_info.user_details
(
    user_guid    text primary key,
    first_name   varchar,
    last_name    varchar,
    email        varchar,
    language     varchar,
    offset_hours integer,
    created_at   timestamp,
    updated_at   timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_guid) REFERENCES user_info.user_login (user_guid)
);