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

export default function AddPropertyForm({ userId, kindeId }: { userId: string, kindeId: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<TAddPropertyFormvaluesSchema>({
    resolver: zodResolver(addPropertyFormvaluesSchema),
    defaultValues: addPropertyFormvaluesSchema.parse({
      name: "",
      description: "",
      pricePerNight: 100,
      maxGuests: 1,
      propertyType: "Home",
      propertyDescription: "",
      isHotel: false,
      city: "",
      state: "",
      country: "",
      userId,
    }),
  });

  if (!userId) {
    return <>Sorry user not authenticated</>;
  }

  console.log("Form errors: ", form.formState.errors);

  async function onSubmit(property: TAddPropertyFormvaluesSchema) {
    try {
      if (!userId) {
        throw new Error("userId not found");
      }
      const result = await addProperty(userId, property);
      if (!result) {
        throw new Error("couldn't create the property");
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
    } finally {
    }

    console.log("data received in the property form: ", property);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-2/5 border p-4 rounded-xl space-y-8 mx-auto"
      >
        {/* field for the property name */}
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

        {/* field for the property description */}
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

        {/* <FormField
          control={form.control}
          name="isHotel"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-bold">Is this a hotel?</FormLabel>
              </div>
            </FormItem>
          )}
        /> */}

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
