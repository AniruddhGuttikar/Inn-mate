DELIMITER //

CREATE TRIGGER UpdatePropertyMaxGuestsHotel
AFTER INSERT ON booking
FOR EACH ROW
BEGIN
    -- Check if the propertyId is not NULL and the property is a hotel
    IF NEW.propertyId IS NOT NULL  THEN
        UPDATE property 
        SET maxGuests = maxGuests - 1
        WHERE id = NEW.propertyId AND isHotel=1;
    END IF;
END //

DELIMITER ;
