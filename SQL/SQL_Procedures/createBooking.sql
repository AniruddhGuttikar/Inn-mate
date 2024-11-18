DELIMITER //

CREATE PROCEDURE InsertBookingAndPayment(
    IN bookingId VARCHAR(255),
    IN totalPrice DECIMAL(10, 2),
    IN userId VARCHAR(255),
    IN propertyId VARCHAR(255),
    IN status VARCHAR(50),
    IN Adult INT,
    IN Child INT,
    IN isShared TINYINT(1),
    IN Numberofrooms INT
)
BEGIN
    DECLARE currentTime DATETIME;
    SET currentTime = NOW();
    DECLARE isHotels TINYINT(1);
    DECLARE totalRooms INT;
    
    -- Start transaction
    START TRANSACTION;

    -- Insert into booking table
    INSERT INTO booking (id, totalPrice, createdAt, updatedAt, userId, propertyId, status, Adult, Child, isShared)
    VALUES (bookingId, totalPrice, currentTime, currentTime, userId, propertyId, status, Adult, Child, isShared);

    -- Insert into payment table
    INSERT INTO payment (id, amount, paymentDate, bookingId)
    VALUES (UUID(), totalPrice, currentTime, bookingId);

    -- Get the property type (hotel or not)
    SELECT isHotel INTO isHotels FROM property WHERE propertyId = propertyId LIMIT 1;

    -- Check if the property is a hotel and if the number of rooms is greater than 0
    IF isHotels AND Numberofrooms > 0 THEN
        -- Update the current space in the property for hotel properties
        UPDATE property 
        SET Current_Space = Current_Space - Numberofrooms 
        WHERE propertyId = propertyId;
    ELSE
        -- If Numberofrooms is not greater than 0, set totalRooms to 1 (if needed)
        SET totalRooms = 1;
    END IF;

    -- Commit the transaction
    COMMIT;
END //

DELIMITER ;
