DELIMITER //

CREATE TRIGGER delete_old_images_after_insert
AFTER INSERT ON image
FOR EACH ROW
BEGIN
    DELETE FROM image WHERE propertyId = NEW.propertyId AND id != NEW.id;
END;

//

DELIMITER ;
