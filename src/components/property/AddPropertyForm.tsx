"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  PropertyTypeEnum,
  TAddPropertyFormvaluesSchema,
  addPropertyFormvaluesSchema,
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
import { addProperty } from "@/actions/propertyActions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Fileinput from "../ui/fileinput";
import { useEffect, useState } from "react";

interface ImageObject {
  id: string;
  link: string;
  propertyId: string;
}


export default function AddPropertyForm() {
  const router = useRouter();
  const { toast } = useToast();

  const { user, isAuthenticated } = useKindeBrowserClient();
  const kindeId = user?.id;

  const form = useForm<TAddPropertyFormvaluesSchema>({
    resolver: zodResolver(addPropertyFormvaluesSchema),
    defaultValues: addPropertyFormvaluesSchema.parse({
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


  const [imageUrls, setImageUrls] = useState<ImageObject[]>([]);

  useEffect(() => {
    const formattedImages = imageUrls.map((image) => ({
      link: image.link,  // This ensures link is a string (URL)
      id: image.id || '',            
      propertyId: image.propertyId || '',  
    }));
    
    form.setValue("images", formattedImages);
  }, [imageUrls, form]);

  if (!user?.id || !isAuthenticated) {
    return <>Sorry, user not authenticated</>;
  }

  async function onSubmit(property: TAddPropertyFormvaluesSchema) {
    try {





      if (!kindeId) {
        throw new Error("userId not found");
      }
  
      // Map the image URLs to the expected structure
      const formattedImages = imageUrls.map((url) => ({
        link: url.link,        
        id: url.id,              
        propertyId: property.id || property.name,      
      }));
  
      // Add the images to the property object
      const propertyWithImages = {
        ...property,
        images: formattedImages, 
      };
  
      const result = await addProperty(kindeId, propertyWithImages);
  
      if (!result) {
        throw new Error("Couldn't create the property");
      }
  
      toast({
        title: "Property added successfully",
        description: "Your new property has been listed.",
      });
  
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push(`/user/${kindeId}/properties`); // Redirect to properties list
    } catch (error) {
      console.error("Failed to add property:", error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    }
  }
  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-2/5 border p-4 rounded-xl space-y-8 mx-auto"
      >
        {/* Property Name Field */}
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

        {/* Property Description Field */}
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

        {/* Price per Night Field */}
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

        {/* Maximum Guests Field */}
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

        {/* Property Type Field */}
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

        {/* City Field */}
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

        {/* State Field */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">State/Province</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country Field */}
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

        {/* File Input Field */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel className="font-bold">Upload Images</FormLabel>
              <FormControl>
              <Fileinput images={imageUrls} setImages={setImageUrls} propertyId={form.getValues("id") || ""} />

              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="mx-auto px-10 py-6 text-lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Adding Property..." : "Add Property"}
        </Button>
      </form>
    </Form>
  );
}
