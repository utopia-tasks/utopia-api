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

CREATE SCHEMA tag_info;

CREATE TABLE tag_info.tag_details
(
    user_guid  text,
    tag_guid   text primary key,
    title      varchar,
    color      varchar,
    created_at timestamp,
    updated_at timestamp,
    FOREIGN KEY (user_guid) REFERENCES user_info.user_login (user_guid)
);

CREATE SCHEMA habit_info;

CREATE TABLE habit_info.habit_details
(
    user_guid  text,
    habit_guid text primary key,
    tag_guid   text,
    title      text,
    streak     integer,
    created_at timestamp,
    updated_at timestamp,
    FOREIGN KEY (user_guid) REFERENCES user_info.user_login (user_guid)
);

CREATE SCHEMA task_info;

CREATE TABLE task_info.list
(
    user_guid   text,
    list_guid   text primary key,
    type        varchar,
    parent_guid text,
    title       varchar,
    color       varchar,
    order_by    integer,
    tags        varchar array,
    created_at  timestamp,
    updated_at  timestamp,
    FOREIGN KEY (user_guid) REFERENCES user_info.user_login (user_guid)
);
CREATE TABLE task_info.task_details
(
    user_guid       text,
    task_guid       text primary key,
    parent_guid     text,
    list_guid       text,
    tag_guid        text,
    title           text,
    description     text,
    status          varchar,
    order_by        integer,
    priority        integer,
    is_repeating    boolean,
    cron            text,
    completion_type varchar,
    due_date        timestamp,
    start_date      timestamp,
    completed_date  timestamp,
    created_at      timestamp,
    updated_at      timestamp,
    FOREIGN KEY (list_guid) REFERENCES task_info.list (list_guid),
    FOREIGN KEY (user_guid) REFERENCES user_info.user_login (user_guid),
    FOREIGN KEY (tag_guid) REFERENCES tag_info.tag_details (tag_guid)
);

CREATE EXTENSION pgcrypto;

CREATE OR REPLACE FUNCTION createAccount (text, varchar, varchar, varchar, varchar, varchar, varchar, int)
    RETURNS SETOF user_info.user_details
    LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
        WITH l AS (
            INSERT INTO user_info.user_login (user_guid, username, password, password_md5, created_at)
                VALUES ($1, $2, crypt($3, gen_salt('md5')), md5($3), now())
                RETURNING *
        )
           , d AS (
            INSERT into user_info.user_details (user_guid, first_name, last_name, email, language, offset_hours, created_at)
                VALUES ($1, $4, $5, $6, $7, $8, now())
                RETURNING *
        )
            TABLE d;
END;
$$;


