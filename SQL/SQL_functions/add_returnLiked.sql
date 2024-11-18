DELIMITER $$

CREATE FUNCTION add_to_favourites(
    p_id VARCHAR(255),
    p_userId VARCHAR(255),
    p_propertyId VARCHAR(255)
) RETURNS VARCHAR(255)
    NOT DETERMINISTIC
    MODIFIES SQL DATA
BEGIN
    DECLARE fav_id VARCHAR(225);

    IF p_id IS NOT NULL THEN
        INSERT INTO favourite (id,userId, propertyId)
        VALUES (p_id,p_userId, p_propertyId);

        SET fav_id = LAST_INSERT_ID();
    ELSE
        UPDATE favourite
        SET userId = p_userId, propertyId = p_propertyId
        WHERE id = p_id;

        SET fav_id = p_id;
    END IF;

    RETURN fav_id;
END $$

DELIMITER ;
