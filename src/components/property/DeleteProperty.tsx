'use client';
import React, { useState, useEffect } from "react";
import { TBooking } from "@/lib/definitions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "../ui/button";
import DeleteModal, { DeleteModalCnf } from "../modals/ConfirmationModal";
import { useRouter } from "next/navigation";
import Captcha from '../verification/captcha';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "@/hooks/use-toast";
import SendMailToUsers from "@/actions/userActions";
import { DeleteBookingsbyIds } from "@/actions/bookingActions";
import { DeletePropertyByIdAdmin, updateProperty, updatePropertyDelete } from "@/actions/propertyActions";

interface DeletePropertyProps {
    bookings: TBooking[];
    userId?: string;
    kindeId?: string;
    propertyId: string;
}

export default function DeleteProperty({ bookings, userId, kindeId, propertyId }: DeletePropertyProps) {
    const [open, setOpen] = useState(false);
    const [delType, setDel] = useState('');
    const [captchaShow, setcs] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDel('');
        setcs(false);
    };

    const handleDelete = async () => {
        setcs(true);
        setOpen(false);
        setDel('delete');
    };

    const handleDeleteSync = async () => {
        console.log('Delete function called');
        setcs(true);
        setOpen(false);
        setDel('deleteSync');
    };

    const onSubmit = async (value: string) => {
        setcs(false);
        if (value) {
            console.log(`deleting: by ${delType}`);

            if (delType === 'delete') {
                if (bookings.length > 0) {
                    const bookingIds = bookings.map((booking) => booking.id);
                    const bookingData = bookings.map((booking) => ({
                        userId: booking.userId,
                        price: booking.totalPrice,
                    }));
                    const result = await SendMailToUsers(bookings);
                    if (!result) {
                        toast({
                            title: 'error',
                            description: 'could not send mail try again',
                        });

                        return null;
                    }
                    //Delete the bookings
                    const result_user = await DeleteBookingsbyIds(bookingIds);
                    if (!result_user) {
                        toast({
                            title: 'error',
                            description: 'could delete bookings try again',
                        });
                        return null;
                    }

                    //
                    const result_prop = await DeletePropertyByIdAdmin(propertyId);
                    if (!result_prop) {
                        toast({
                            title: 'error',
                            description: 'could delete property try again',
                        });
                        return null;
                    }
                } else {
                    const result_prop = await DeletePropertyByIdAdmin(propertyId);
                    if (!result_prop) {
                        toast({
                            title: 'error',
                            description: 'could delete property try again',
                        });
                        return null;
                    }

                }
            } else {
                console.log("here");
                //Handle scheduled delete
                const bookingIds = bookings.map((booking) => booking.id);
                const today = new Date();
                const oneMonthLater = new Date(today.setMonth(today.getMonth() + 1)); // Today's date + 1 month
              
                bookings.forEach(async (booking) => {
                  if (booking.startDate > oneMonthLater) {
                    console.log(`Deleting 1 month booking with ID: ${booking.id}`);
                    const result_prop = await DeletePropertyByIdAdmin(propertyId);
                        if (!result_prop) {
                            toast({
                                title: 'error',
                                description: 'could delete property try again',
                            });
                            return null
                        }

                    const result_user = await DeleteBookingsbyIds(bookingIds);
                        if (!result_user) {
                            toast({
                                title: 'error',
                                description: 'could delete bookings try again',
                            });
                            return null
                        }
                  } 
                  else {
                    // Calculate the maximum end date from the bookings
                    const maxDate = bookings.reduce((max, booking) => {
                      return booking.endDate > max ? booking.endDate : max;
                    }, new Date(0));
                  
                    if (kindeId) {
                      await updatePropertyDelete(kindeId, propertyId, true);
                    }
                  
                    console.log(`Scheduling deletion for property ID: ${propertyId} after max booking date.`);
                  
                    // Schedule the property deletion by sending the request to the scheduler API
                    fetch('/api/scheduler', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: propertyId, // use the actual property ID here
                        maxDate: maxDate.toISOString(), // send the maxDate as an ISO string
                      }),
                    })
                      .then(response => response.json())
                      .then(data => console.log('Scheduler response:', data))
                      .catch(error => console.error('Error scheduling deletion:', error));
                  }
                  
                });
                
                return null;
            }
        }
    };

    return (
        <div>
            <div className="container mx-auto p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Current bookings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card key={5} className="bg-white shadow-md rounded-lg p-4">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">Booking for User ID: {'booking.userId'}</CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                Status: <span className="font-medium">{'booking.status'}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-4">
                            <div className="text-gray-700">
                                <p>
                                    <span className="font-semibold">Start Date:</span> {'format(new Date(booking.startDate), "MMM dd, yyyy")'}
                                </p>
                                <p>
                                    <span className="font-semibold">End Date:</span> {'format(new Date(booking.endDate), "MMM dd, yyyy")'}
                                </p>
                                <p>
                                    <span className="font-semibold">Total Price:</span> ${'booking.totalPrice.toFixed(2)'}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <Button
                type="button"
                className="flex mx-auto my-4 px-10 py-6 text-black-600 bg-red-500 hover:bg-red-700 rounded font-bold items-center justify-center"
                onClick={handleClickOpen}
            >
                Delete Property
            </Button>

            <DeleteModalCnf
                open={open}
                onClose={handleClose}
                bookingsCount={1}
                onDelete={async () => {
                    await handleDelete();
                }}
                onDelete_sch={async () => {
                    await handleDeleteSync();
                }}
            />

            {captchaShow && (
                <div className="flex justify-center items-center fixed inset-0 z-50 bg-white bg-opacity-90">
                    <ReCAPTCHA
                        sitekey="6Lftwm0qAAAAACcpDNPVuN-50LYdpJci3fMYEn3L"
                        onChange={(value) => {
                            if (value) {
                                onSubmit(value);
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}
