  -- Create a deletion_log table to store the log of deleted properties
  CREATE TABLE IF NOT EXISTS deletion_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propertyId VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    name VARCHAR(225) NOT NULL,
    price VARCHAR(225) NOT NULL,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create the trigger to log deletions
  DELIMITER $$

  CREATE TRIGGER log_property_deletion
  BEFORE DELETE ON property
  FOR EACH ROW
  BEGIN
    -- Log the deletion of the property
    INSERT INTO deletion_log (propertyId,userId,name,price) VALUES (OLD.id,OLD.userId,OLD.name,OLD.pricePerNight);
  END $$

  DELIMITER ;
