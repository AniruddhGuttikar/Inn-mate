-- Create a deletion_log table to store the log of deleted properties
CREATE TABLE IF NOT EXISTS deletion_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  propertyId VARCHAR(255) NOT NULL,
  deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the trigger to log updates to the isDeleted field
DELIMITER $$

CREATE TRIGGER log_property_deletion
BEFORE UPDATE ON property
FOR EACH ROW
BEGIN
  -- Only log when the isDeleted status changes
  IF OLD.isDeleted <> NEW.isDeleted THEN
    INSERT INTO deletion_log (propertyId) VALUES (OLD.id);
  END IF;
END $$

DELIMITER ;
