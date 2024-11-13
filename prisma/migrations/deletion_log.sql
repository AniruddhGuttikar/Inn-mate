  -- Create a deletion_log table to store the log of deleted properties
  CREATE TABLE IF NOT EXISTS deletion_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propertyId VARCHAR(255) NOT NULL,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create the trigger to log deletions
  DELIMITER $$

  CREATE TRIGGER log_property_deletion
  BEFORE DELETE ON property
  FOR EACH ROW
  BEGIN
    -- Log the deletion of the property
    INSERT INTO deletion_log (propertyId) VALUES (OLD.id);
  END $$

  DELIMITER ;
