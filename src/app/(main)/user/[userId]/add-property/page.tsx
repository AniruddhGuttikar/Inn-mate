import { locationSchema, propertySchema } from "@/lib/definitions";

const addPropertySchema = propertySchema.merge(
  locationSchema.omit({ id: true })
);
