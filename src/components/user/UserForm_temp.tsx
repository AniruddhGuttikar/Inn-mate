// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { TUser, GenderTypeEnum, userSchema } from "@/lib/definitions";
// import { useToast } from "@/hooks/use-toast";
// import {
//   createUser,
//   getUserByKindeId,
//   isAuthenticatedUserInDb,
//   updateUser,
// } from "@/actions/userActions";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

// export const UserForm = ({ user }: { user: TUser }) => {
//   const { toast } = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm<TUser>({
//     resolver: zodResolver(userSchema),
//     defaultValues: {
//       name: user.name,
//       email: user.email,
//       dob: user.dob,
//       gender: user.gender,
//       address: {
//         city: user.address.city,
//         state: user.address.state,
//         country: user.address.country,
//       },
//     },
//   });

//   if (!user) {
//     console.log(user);
//     return <>{`Sorry, you are not logged in`}</>;
//   }

//   async function onSubmit(data: TUser) {
//     setIsSubmitting(true);
//     console.log("Trying to update/create the user");
//     try {
//       if (!user || !user.id) {
//         throw new Error("Couldn't create/update the user");
//       }
//       const existingUser = await getUserByKindeId(user?.id);
//       if (!existingUser) {
//         const result = await createUser(data);
//         if (result) {
//           toast({
//             title: "Profile created successfully",
//             description: "Your profile has been created",
//           });
//         } else {
//           throw new Error("Couldn't create the user");
//         }
//       } else if (
//         existingUser.id &&
//         (await isAuthenticatedUserInDb(existingUser.id))
//       ) {
//         const result = await updateUser(data);
//         if (result) {
//           toast({
//             title: "Profile updated successfully",
//             description: "Your profile information has been updated.",
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Failed to update profile:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update profile. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input placeholder={user.name} {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input placeholder={user.email} {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="dob"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Date of Birth</FormLabel>
//               <FormControl>
//                 <Input
//                   type="date"
//                   {...field}
//                   value={
//                     field.value instanceof Date
//                       ? field.value.toISOString().split("T")[0]
//                       : ""
//                   }
//                   onChange={(e) => field.onChange(new Date(e.target.value))}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="gender"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Gender</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select gender" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {Object.values(GenderTypeEnum.enum).map((gender) => (
//                     <SelectItem key={gender} value={gender}>
//                       {gender}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="address.city"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>City</FormLabel>
//               <FormControl>
//                 <Input placeholder={user.address.city} {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="address.state"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>State</FormLabel>
//               <FormControl>
//                 <Input placeholder={user.address.state} {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="address.country"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Country</FormLabel>
//               <FormControl>
//                 <Input placeholder={user.address.country} {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button
//           type="submit"
//           disabled={isSubmitting || form.formState.isSubmitting}
//         >
//           {isSubmitting ? "Updating Profile..." : "Update Profile"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

"use client";
import { createUser } from "@/actions/userActions";
import { TUser, userSchema } from "@/lib/definitions";
import React, { useState } from "react";

export const BasicUserForm = ({ user }: { user: TUser }) => {
  console.log("user received in form: ", user);
  const [formData, setFormData] = useState(user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [objectKey, nestedKey] = name.split(".");
      setFormData((prevData) => {
        if (objectKey === "address") {
          return {
            ...prevData,
            address: {
              ...prevData.address,
              [nestedKey]: value,
            },
          };
        }
        return prevData;
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === "dob" ? new Date(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(e);

    // Simulate an API call
    console.log("Form submitted with data:", formData);
    const validatedUserFormData = userSchema.parse(formData);
    console.log("validated user details: ", validatedUserFormData);

    const result = await createUser(validatedUserFormData);

    // Reset form after submission
    setFormData({
      name: "",
      address: {
        city: "",
        country: "",
        state: "",
      },
      email: "",
      dob: new Date(),
      gender: "OTHERS",
      kindeId: "",
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="address.city">City:</label>
        <input
          type="text"
          id="address.city"
          name="address.city"
          value={formData.address.city}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="address.state">State:</label>
        <input
          type="text"
          id="address.state"
          name="address.state"
          value={formData.address.state}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="address.country">Country:</label>
        <input
          type="text"
          id="address.country"
          name="address.country"
          value={formData.address.country}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="dob">Date of Birth:</label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob.toISOString().split("T")[0]}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHERS">Others</option>
        </select>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
