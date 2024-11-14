DELIMITER $$

CREATE PROCEDURE get_filtered_listings(
  IN p_destination VARCHAR(255),
  IN p_checkIn DATETIME,
  IN p_checkOut DATETIME,
  IN p_propertyTypeValue VARCHAR(255)
)
BEGIN
  SELECT p.*, l.availabilityStart, l.availabilityEnd
  FROM listing AS l
  JOIN property AS p ON p.id = l.propertyId
  WHERE 1 = 1
  AND (
    (p_destination IS NULL OR 
      MATCH(p.name, p.description, p.city, p.state, p.country) AGAINST (p_destination IN NATURAL LANGUAGE MODE))
  )
  AND (
    (p_checkIn IS NULL OR l.availabilityStart <= p_checkIn)
    AND (p_checkOut IS NULL OR l.availabilityEnd >= p_checkOut)
  )
  AND (
    (p_propertyTypeValue IS NULL OR p.propertyType = p_propertyTypeValue)
  )
  LIMIT 20;
END $$

DELIMITER ;
