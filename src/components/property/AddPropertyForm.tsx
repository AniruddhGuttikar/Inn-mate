"use client";

import cuid from 'cuid';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  PropertyTypeEnum,
  TAddPropertyFormvaluesSchema,
  addPropertyFormValuesSchema,
} from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addProperty, getAllImagesbyId, getPropertyById, updateProperty } from "@/actions/propertyActions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Fileinput from "../ui/fileinput";
import { useEffect, useState } from "react";
import { getLocationById } from '@/actions/locationActions';
import DeleteModal from '../modals/ConfirmationModal';

interface ImageObject {
  id: string;
  link: string;
  propertyId: string;
}

type AddPropertyFormProps = {
  userId?: string;
  propId?: string;
};

type PropertyType = typeof PropertyTypeEnum["_type"];

interface PropertyDet {
  name: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  propertyType: PropertyType;
  isHotel: boolean;
  city: string;
  state: string;
  country: string;
  images: ImageObject[];
}

export default function AddPropertyForm({ userId, propId }: AddPropertyFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated } = useKindeBrowserClient();
  const kindeId = user?.id;
  const propertyId = cuid();
  const [open, setOpen] = useState(false);

  const [prop, setProp] = useState<PropertyDet>();
  const [isEdit, setIsEdit] = useState(false);
  const [imageUrls, setImageUrls] = useState<ImageObject[]>([]);

  const form = useForm<TAddPropertyFormvaluesSchema>({
    resolver: zodResolver(addPropertyFormValuesSchema),
    defaultValues: addPropertyFormValuesSchema.parse({
      name: "",
      description: "",
      pricePerNight: 100,
      maxGuests: 1,
      propertyType: "Home",
      isHotel: false,
      city: "",
      state: "",
      country: "",
      images: [],
    }),
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (userId && propId) {
        const property = await getPropertyById(propId);
        if (property && property.locationId) {
          const location = await getLocationById(property.locationId);
          const imageLinks = await getAllImagesbyId(propId) ?? [];
          setImageUrls(imageLinks);
          setProp({
            ...property,
            images: imageLinks,
            city: location?.city || "",
            state: location?.state || "",
            country: location?.country || ""
          });
          setIsEdit(true);
        }
      }
    };

    fetchProperty();
  }, [userId, propId]);

  useEffect(() => {
    if (prop && isEdit) {
      form.reset({
        name: prop?.name || "",
        description: prop?.description || "",
        pricePerNight: prop?.pricePerNight || 100,
        maxGuests: prop?.maxGuests || 1,
        propertyType: prop.propertyType as PropertyType | undefined || "Home",
        isHotel: prop?.isHotel || false,
        city: prop?.city || "",
        state: prop?.state || "",
        country: prop?.country || "",
        images: prop?.images || [],
      });
    }
  }, [prop, isEdit, form]);

  if (!isAuthenticated) {
    return <>Sorry, user not authenticated</>;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setOpen(false);
  };

  // Function to handle delete
  const handleDelete = async () => {
    console.log('Delete function called');
    // Here you can add the delete logic (e.g., API call)
    // For now, we'll just log deleteConfirm
    const deleteConfirm = true; // Mock confirmation value
    if (deleteConfirm) {
      console.log('Delete confirmed');
      //Delete confirm called url updated
      router.push(`${propId}/DeleteProps`)
    }
    
    // After deletion, close the modal
    handleClose();
  };

  const onSubmit = async (property: TAddPropertyFormvaluesSchema) => {
    try {
      if (!kindeId) {
        throw new Error("User ID not found");
      }

      const formattedImages = imageUrls.map((url) => ({
        link: url.link,
        id: cuid(),
        propertyId: propertyId,
      }));

      const propertyWithImages = imageUrls.length > 0
        ? { ...property, images: formattedImages }
        : { ...property };

      if (!isEdit) {
        const result = await addProperty(kindeId, propertyWithImages);
        if (!result) {
          throw new Error("Couldn't create the property");
        }

        toast({
          title: "Property added successfully",
          description: "Your new property has been listed.",
        });
      } else {
        if (propId) {
          const result = await updateProperty(kindeId, propId, propertyWithImages);
          if (!result) {
            throw new Error("Couldn't create the property");
          }

          toast({
            title: "Property Updated successfully",
            description: "Your property has been Updated.",
          });
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/user/${kindeId}/properties`);
    } catch (error) {
      console.log("Error in adding prop:", error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)(e);
          }}
          className="flex flex-col w-2/5 border p-4 rounded-xl space-y-8 mx-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Property Name</FormLabel>
                <FormControl>
                  <Input placeholder="Cozy Cottage" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A charming cottage nestled in the heart of the countryside..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pricePerNight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Price per Night (INR)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Maximum Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Property Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PropertyTypeEnum.enum).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Country</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <Fileinput
              images={imageUrls}
              setImages={setImageUrls}
              propertyId={form.getValues("id") || ""}
            />
      
            <Button
          type="submit"
          className="mx-auto px-10 py-6 text-lg"
          disabled={form.formState.isSubmitting}
          >
          {isEdit
            ? form.formState.isSubmitting
            ? "Editing Property..."
            : "Edit Property"
            : form.formState.isSubmitting
            ? "Adding Property..."
            : "Add Property"}
        </Button>
          {isEdit &&(
            <Button type='button' className="mx-auto px-10 py-6 text-black-600 bg-red-500 hover:bg-red-700 rounded font-bold"
              onClick={handleClickOpen}>
              Delete Property
            </Button>
            )}
        </form>
      </Form>
      <DeleteModal
        open={open}
        onClose={handleClose}
        bookingsCount={0}
        onDelete={async () => {
          await handleDelete();
          console.log('Delete confirmed'); // Log confirmation when "Yes" is pressed
        }}
      />
    </>
  );
}
