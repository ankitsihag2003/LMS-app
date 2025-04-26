import React, { useEffect } from 'react'
import { Button } from './button'
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi';

const PurchaseCourseBtn = ({courseId}) => {

  const [createCheckoutSession,{data,isLoading,isSuccess,isError,error}]=useCreateCheckoutSessionMutation();

  const purchaseHandler = async () => {
    await createCheckoutSession(courseId);
  }

  useEffect(() => {
    if(isSuccess){
      window.location.href = data.url;  //redirect to the checkout page
    }
    if(isError){
      toast.error(error?.data?.message || "failed to redirect to checkout session");  //display error message if failed to create checkout session
    }
    
  }, [data, isSuccess, isError, error])
  

  return (
    <Button className='w-full bg-purple-600 hover:bg-purple-700' onClick={purchaseHandler}>
      {isLoading? (
          <>
          <Loader2 className="mr-4 h-4 w-4 animate-spin"/>
          Please wait
          </>
      ) : "Buy Course Now"
      }
    </Button>
  )
}

export default PurchaseCourseBtn