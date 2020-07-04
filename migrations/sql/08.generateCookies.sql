CREATE OR REPLACE FUNCTION generateCookies(text, text, text)
    RETURNS BOOLEAN
    LANGUAGE sql AS $$
WITH l AS (
    INSERT INTO cookie.login (user_guid, token, created_at)
        VALUES ($1, $2, now())
        RETURNING TRUE
),
     s AS (
         INSERT into cookie.session (user_guid, session_id, created_at)
             VALUES ($1, $3, now())
             RETURNING TRUE
     )
SELECT EXISTS ((SELECT TRUE FROM l) UNION ALL (SELECT TRUE FROM s));
$$;