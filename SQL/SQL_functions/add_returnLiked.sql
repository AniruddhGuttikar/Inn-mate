DELIMITER $$

CREATE FUNCTION add_to_favourites(
  p_id INT,
  p_userId VARCHAR(255),
  p_propertyId VARCHAR(255)
) RETURNS INT
BEGIN
  DECLARE fav_id INT;

  IF p_id IS NULL THEN
    INSERT INTO favourite (userId, propertyId)
    VALUES (p_userId, p_propertyId);

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
