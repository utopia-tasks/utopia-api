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