CREATE SCHEMA cookie;

CREATE TABLE cookie.login
(
    user_guid text,
    uuid_password text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_guid) REFERENCES user_info.user_login (user_guid)
);

CREATE TABLE cookie.session
(
    user_guid text,
    session_id text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);