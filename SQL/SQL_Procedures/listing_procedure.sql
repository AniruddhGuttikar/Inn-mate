DELIMITER $$

CREATE PROCEDURE insert_new_listing(
  IN p_newListingId VARCHAR(225),
  IN p_availabilityStart DATETIME,
  IN p_availabilityEnd DATETIME,
  IN p_userId VARCHAR(255),
  IN p_propertyId VARCHAR(255)
)
BEGIN


  INSERT INTO listing (id, availabilityStart, availabilityEnd, updatedAt, userId, propertyId)
  VALUES (p_newListingId, p_availabilityStart, p_availabilityEnd, NOW(), p_userId, p_propertyId);

  SELECT * FROM listing AS l WHERE l.id = p_newListingId COLLATE utf8mb4_unicode_ci;

END $$

DELIMITER ;
