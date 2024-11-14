DELIMITER $$

CREATE EVENT update_booking_status
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
  -- Set bookings to 'ACTIVE' if the check-in date is today or earlier and check-out is in the future
  UPDATE booking
  SET status = 'ACTIVE'
  WHERE checkinDate <= CURDATE() AND checkoutDate > CURDATE();

  -- Set bookings to 'COMPLETED' if the check-out date is today or earlier
  UPDATE booking
  SET status = 'COMPLETED'
  WHERE checkoutDate <= CURDATE();
END $$

DELIMITER ;
