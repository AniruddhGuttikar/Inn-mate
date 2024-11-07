DELIMITER //

CREATE PROCEDURE AddProperty(
  IN propertyId VARCHAR(255),
  IN userId VARCHAR(255),
  IN name VARCHAR(225),
  IN description VARCHAR(225),
  IN isDeleted BOOLEAN,
  IN pricePerNight VARCHAR(225),
  IN maxGuests VARCHAR(225),
  IN updatedAt VARCHAR(225),
  IN country VARCHAR(255),
  IN state VARCHAR(255),
  IN city VARCHAR(255),
  IN propertyType VARCHAR(255),
  IN roomType VARCHAR(255),
  IN isHotel BOOLEAN,
  IN images JSON,
  IN amenities JSON
)
BEGIN
  DECLARE locationId VARCHAR(255); -- To hold location ID
  DECLARE newLocationId VARCHAR(255);

  -- Check if location exists, else insert and set locationId
  SELECT id INTO locationId FROM location
  WHERE country = country AND state = state AND city = city;
  
  -- If location doesn't exist, create a new location and use UUID as locationId
  IF locationId IS NULL THEN
    SET newLocationId = UUID(); -- Generate a new locationId using UUID
    INSERT INTO location (id, country, state, city)
    VALUES (newLocationId, country, state, city);
    SET locationId = newLocationId; -- Use the newly generated locationId
  END IF;

  -- Insert property using the provided propertyId
  INSERT INTO property (id, userId, name, description, isDeleted, pricePerNight,maxGuests,updatedAt, locationId, propertyType, roomType, isHotel)
  VALUES (propertyId, userId, name, description, isDeleted, pricePerNight,maxGuests,updatedAt, locationId, propertyType, roomType, isHotel);

  -- Insert images
  IF JSON_LENGTH(images) > 0 THEN
    -- Insert each image with the provided propertyId and a generated imageId
    INSERT INTO image (id, propertyId, link)
    SELECT UUID(), propertyId, link
    FROM JSON_TABLE(images, "$[*]" COLUMNS (link VARCHAR(255) PATH "$")) AS img;
  END IF;

  -- Insert amenities
  IF JSON_LENGTH(amenities) > 0 THEN
    -- Insert each amenity with the provided propertyId and a generated amenityId
    INSERT INTO amenity (id, propertyId, name)
    SELECT UUID(), propertyId, name
    FROM JSON_TABLE(amenities, "$[*]" COLUMNS (name VARCHAR(255) PATH "$")) AS amn;
  END IF;
  
END //

DELIMITER ;
