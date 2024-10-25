"use client";

import cuid from 'cuid';
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
  const propertyId=cuid()

  const form = useForm<TAddPropertyFormvaluesSchema>({
    resolver: zodResolver(addPropertyFormvaluesSchema),
    defaultValues: addPropertyFormvaluesSchema.parse({
      id:propertyId,
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


  if (!isAuthenticated) {
    return <>Sorry, user not authenticated</>;
  }


  console.log(form.formState.isSubmitting)

  const onSubmit = async (property: TAddPropertyFormvaluesSchema) => {

    
    try {
      if (!kindeId) {
        throw new Error("User ID not found");
      }

      const formattedImages = imageUrls.map((url) => ({
        link: url.link,
        id: cuid(),
        propertyId: propertyId
      }));

      const propertyWithImages = imageUrls.length >0 ?{
        ...property,
        images: formattedImages, // Pass empty array if no images
    } :{
      ...property
    };

    console.log(propertyWithImages)



      const result = await addProperty(kindeId, propertyWithImages);

      if (!result) {
        throw new Error("Couldn't create the property");
      }

      toast({
        title: "Property added successfully",
        description: "Your new property has been listed.",
      });

      await new Promise((resolve) => setTimeout(resolve,4000));
      router.push(`/user/${kindeId}/properties`);
    } catch (error) {
      console.log("Error in adding prop:",error)
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
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

        {/* field for price per night */}
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

        {/* field for max guests*/}
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
              <FormLabel className="font-bold">State/Province</FormLabel>
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
          <FormLabel className="font-bold">Upload Images</FormLabel>
          
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
          {form.formState.isSubmitting ? "Adding Property..." : "Add Property"}
        </Button>
      </form>
    </Form>
  );
}
