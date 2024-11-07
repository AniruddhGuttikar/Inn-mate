DELIMITER //
CREATE TRIGGER before_property_insert
BEFORE INSERT ON property
FOR EACH ROW
BEGIN
  DECLARE count INT;
  SELECT COUNT(*) INTO count
  FROM property
  WHERE userId = NEW.userId AND locationId = NEW.locationId;

  IF count > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Duplicate property for user at the same location.';
  END IF;
END //
DELIMITER ;

-- The trigger is designed to prevent a user from adding duplicate properties at the same location.
--  It ensures that a user cannot add more than one property at the same locationId in the property table.