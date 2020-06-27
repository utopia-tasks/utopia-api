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