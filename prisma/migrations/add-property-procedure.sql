  DELIMITER //

  CREATE PROCEDURE AddProperty(
    IN propertyId VARCHAR(191),
    IN userId VARCHAR(191),
    IN name VARCHAR(191),
    IN description VARCHAR(191),
    IN isDeleted BOOLEAN,
    IN pricePerNight DECIMAL(10, 2),
    IN maxGuests INT,
    IN updatedAt DATETIME,
    IN propertyCountry VARCHAR(191),
    IN propertyState VARCHAR(191),
    IN propertyCity VARCHAR(191),
    IN propertyType VARCHAR(191),
    IN roomType VARCHAR(191),
    IN isHotel BOOLEAN,
    IN images JSON,
    IN amenities JSON,
    IN inputLocationId VARCHAR(191)  -- Renamed from newLocationId
  )
  BEGIN
    DECLARE locationId VARCHAR(191);

    -- Check if location exists, else insert and set locationId
    SELECT id INTO locationId
    FROM location
    WHERE country COLLATE utf8mb4_unicode_ci = propertyCountry COLLATE utf8mb4_unicode_ci
      AND state COLLATE utf8mb4_unicode_ci = propertyState COLLATE utf8mb4_unicode_ci
      AND city COLLATE utf8mb4_unicode_ci = propertyCity COLLATE utf8mb4_unicode_ci;

    -- If location doesn't exist, use inputLocationId as new location id
    IF locationId IS NULL THEN
      INSERT INTO location (id, country, state, city)
      VALUES (inputLocationId, propertyCountry, propertyState, propertyCity);
      SET locationId = inputLocationId;
    END IF;

    -- Insert property
    INSERT INTO property (id, userId, name, description, isDeleted, pricePerNight, maxGuests, updatedAt, locationId, propertyType, roomType, isHotel)
    VALUES (propertyId, userId, name, description, isDeleted, pricePerNight, maxGuests, updatedAt, locationId, propertyType, roomType, isHotel);


  IF JSON_LENGTH(images) IS NOT NULL AND JSON_LENGTH(images) > 0 THEN
      INSERT INTO image (id, propertyId, link)
      SELECT img.imageId, propertyId, img.link
      FROM JSON_TABLE(images, "$[*]" 
          COLUMNS (
              imageId VARCHAR(191) PATH "$.imageId", -- Define imageId here
              link VARCHAR(191) PATH "$.link"
          )
      ) AS img
      WHERE img.link IS NOT NULL AND img.link <> '';  -- Ensures link is not NULL or empty
  END IF;


  DELIMITER //

  CREATE PROCEDURE AddProperty(
    IN propertyId VARCHAR(191),
    IN userId VARCHAR(191),
    IN name VARCHAR(191),
    IN description VARCHAR(191),
    IN isDeleted BOOLEAN,
    IN pricePerNight DECIMAL(10, 2),
    IN maxGuests INT,
    IN updatedAt DATETIME,
    IN propertyCountry VARCHAR(191),
    IN propertyState VARCHAR(191),
    IN propertyCity VARCHAR(191),
    IN propertyType VARCHAR(191),
    IN roomType VARCHAR(191),
    IN isHotel BOOLEAN,
    IN images JSON,
    IN amenities JSON,
    IN inputLocationId VARCHAR(191)
  )
  BEGIN
    DECLARE locationId VARCHAR(191);

    -- Check if location exists, else insert and set locationId
    SELECT id INTO locationId
    FROM location
    WHERE country COLLATE utf8mb4_unicode_ci = propertyCountry COLLATE utf8mb4_unicode_ci
      AND state COLLATE utf8mb4_unicode_ci = propertyState COLLATE utf8mb4_unicode_ci
      AND city COLLATE utf8mb4_unicode_ci = propertyCity COLLATE utf8mb4_unicode_ci;

    -- If location doesn't exist, use inputLocationId as new location id
    IF locationId IS NULL THEN
      INSERT INTO location (id, country, state, city)
      VALUES (inputLocationId, propertyCountry, propertyState, propertyCity);
      SET locationId = inputLocationId;
    END IF;

    -- Insert property
    INSERT INTO property (id, userId, name, description, isDeleted, pricePerNight, maxGuests, updatedAt, locationId, propertyType, roomType, isHotel)
    VALUES (propertyId, userId, name, description, isDeleted, pricePerNight, maxGuests, updatedAt, locationId, propertyType, roomType, isHotel);

    -- Insert images if provided
    IF JSON_LENGTH(images) > 0 THEN
      INSERT INTO image (id, propertyId, link)
      SELECT img.imageId, propertyId, img.link
      FROM JSON_TABLE(images, "$[*]" 
          COLUMNS (
              imageId VARCHAR(191) PATH "$.imageId",
              link VARCHAR(191) PATH "$.link"
          )
      ) AS img
      WHERE img.link IS NOT NULL AND img.link <> '';
    END IF;

    -- Insert amenities if provided
    IF JSON_LENGTH(amenities) > 0 THEN
      INSERT INTO amenity (id, propertyId, name)
      SELECT 
        UUID(), -- Generate a unique ID for each amenity
        propertyId,
        amn.name
      FROM JSON_TABLE(amenities, "$[*]" 
        COLUMNS (
          name VARCHAR(191) PATH "$.name"
        )
      ) AS amn
      WHERE amn.name IN ('WIFI', 'PARKING', 'AIR_CONDITIONING', 'COFFEE', 'PARK', 'POOL', 'GYM', 'KITCHEN', 'TV', 'LAUNDRY', 'PET_FRIENDLY');
    END IF;
  END //

  DELIMITER ;

  DELIMITER ;
