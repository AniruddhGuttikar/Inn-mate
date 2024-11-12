CREATE TRIGGER delete_old_images_before_insert
BEFORE INSERT ON property
FOR EACH ROW
BEGIN
    DELETE FROM Image WHERE propertyId = NEW.id;
END;
