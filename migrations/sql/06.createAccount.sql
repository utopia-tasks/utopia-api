CREATE EXTENSION IF NOT EXISTS pgcrypto;

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