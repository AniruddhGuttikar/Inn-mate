"use client";

import { GenderTypeEnum, TUser, userSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  createUser,
  isAuthenticatedUserInDb,
  updateUser,
} from "@/actions/userActions";
import { useRouter } from "next/navigation";

export const UserForm = ({ user }: { user: TUser }) => {
  //   console.log("data received in the form: ", user);
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: user,
  });

  const router = useRouter();

  const { toast } = useToast();

  // Adding a console log for errors if validation fails
  console.log("Form errors: ", form.formState.errors);

  const onSubmit = async (user: TUser) => {
    console.log("inside the submit button: ", user);
    try {
      if (user.id && (await isAuthenticatedUserInDb(user.id))) {
        const result = await updateUser(user);
        if (!result) {
          throw new Error("couldn't update the user");
        }

        toast({
          title: "Profile created successfully",
          description: "Your profile has been created, redirecting to home",
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/");
      } else {
        const result = await createUser(user);
        if (!result) {
          throw new Error("couldn't create the user");
        }
        toast({
          title: "Profile updated successfully",
          description: "Your profile has been updated, redirecting to home",
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/");
      }
    } catch (error) {
      console.log("Error in submitting the form: ", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/5 border p-4 rounded-xl mx-auto space-y-6 flex flex-col"
      >
        {/* field for user name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Name</FormLabel>
              <FormControl>
                <Input placeholder={user.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* field for user email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Email</FormLabel>
              <FormControl>
                <Input placeholder={user.email} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* field for user DOB */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Date of Birth</FormLabel>
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

        {/* field for user gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Gender</FormLabel>
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

        {/* field for user address*/}
        <FormField
          control={form.control}
          name="address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">City</FormLabel>
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
              <FormLabel className="font-bold">State</FormLabel>
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
              <FormLabel className="font-bold">Country</FormLabel>
              <FormControl>
                <Input placeholder={user.address.country} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="mx-auto px-10 py-6 text-lg"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Updating Profile..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
