CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Creation of User table
CREATE TABLE IF NOT EXISTS "user" (
    uid uuid DEFAULT uuid_generate_v4 (),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    nickname VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (uid)
);

-- Creation of Tag table
CREATE TABLE IF NOT EXISTS "tag" (
    id SERIAL,
    creator uuid NOT NULL,
    name VARCHAR(40) UNIQUE,
    sort_order INT DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_creator
        FOREIGN KEY(creator)
            REFERENCES "user"(uid) ON DELETE CASCADE
);

-- Creation of UserTag table
CREATE TABLE IF NOT EXISTS "userTag" (
    user_id uuid NOT NULL,
    tag_id INT NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES "user"(uid) ON DELETE CASCADE,
    CONSTRAINT fk_tag_id
        FOREIGN KEY(tag_id)
            REFERENCES "tag"(id) ON DELETE CASCADE
);


BEGIN;
CREATE OR REPLACE FUNCTION update_refresh_expire_timestamp()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.refresh_expire = now() + INTERVAL '7 DAYS';
    RETURN NEW;
END;
$$ language 'plpgsql';
COMMIT;


BEGIN;
-- Creation of TokenStorage table
CREATE TABLE IF NOT EXISTS "tokens_storage" (
                                                user_id uuid NOT NULL,
                                                access_token VARCHAR(255) NOT NULL,
                                                refresh_token VARCHAR(255) NOT NULL,
                                                refresh_expire TIMESTAMP,
                                                CONSTRAINT fk_user
                                                    FOREIGN KEY(user_id)
                                                        REFERENCES "user"(uid) ON DELETE CASCADE
);
CREATE TRIGGER user_timestamp BEFORE INSERT OR UPDATE ON tokens_storage
    FOR EACH ROW EXECUTE PROCEDURE update_refresh_expire_timestamp();

COMMIT;
