"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { TUser, GenderTypeEnum, userSchema } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import {
  createUser,
  getUserByKindeId,
  isAuthenticatedUserInDb,
  updateUser,
} from "@/actions/userActions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

// Create a new schema for the form, omitting fields that shouldn't be updated

export const UserForm = ({ user }: { user: TUser }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user: kindeUser, isAuthenticated } = useKindeBrowserClient();

  if (!kindeUser || !isAuthenticated) {
    return <>sorry you are not logged in</>;
  }

  const form = useForm<TUser>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      dob: user.dob,
      gender: user.gender,
      address: {
        city: user.address.city,
        state: user.address.state,
        country: user.address.country,
      },
    },
  });

  async function onSubmit(data: TUser) {
    setIsSubmitting(true);
    try {
      if (!kindeUser) {
        throw new Error("couldn't create the user");
      }
      const user = await getUserByKindeId(kindeUser.id);
      // if the user is not present in the database CREATE
      if (!user) {
        const result = await createUser(data);
        if (result) {
          toast({
            title: "Profile created successfully",
            description: "Your profile has been created",
          });
        } else {
          throw new Error("couldn't create the user");
        }
      } else {
        // if the user is there then UPDATE
        const result = await updateUser(data);
        if (result) {
          toast({
            title: "Profile updated successfully",
            description: "Your profile information has been updated.",
          });
        }
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder={user.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder={user.email} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(GenderTypeEnum.enum).map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
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
          name="address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder={user.address.city} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder={user.address.state} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder={user.address.country} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating Profile..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};
