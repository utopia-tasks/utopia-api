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