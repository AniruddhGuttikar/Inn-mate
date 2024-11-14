DELIMITER //

CREATE PROCEDURE InsertBookingAndPayment(
    IN bookingId VARCHAR(255),
    IN totalPrice DECIMAL(10, 2),
    IN userId VARCHAR(255),
    IN propertyId VARCHAR(255),
    IN status VARCHAR(50),
    IN Adult INT,
    IN Child INT,
    IN isShared tinyint(1)
)
BEGIN
    DECLARE currentTime DATETIME;
    SET currentTime = NOW();

    -- Start transaction
    START TRANSACTION;

    -- Insert into booking table
    INSERT INTO booking (id, totalPrice, createdAt, updatedAt, userId, propertyId, status, Adult, Child,isShared)
    VALUES (bookingId, totalPrice, currentTime, currentTime, userId, propertyId, status, Adult, Child,isShared);

    -- Insert into payment table
    INSERT INTO payment (id, amount, paymentDate, bookingId)
    VALUES (UUID(), totalPrice, currentTime, bookingId);

    -- Commit the transaction
    COMMIT;
END //

DELIMITER ;
