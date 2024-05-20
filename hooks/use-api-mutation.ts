import { useMutation } from "convex/react";
import { useState } from "react";


export const useApiMutation = (mutationFunction: any) => {
    const [pending, setPending] = useState(false);
    const apiMutation = useMutation(mutationFunction);

    
    const mutate = (payload: any) => { //called when the components trigger the mutation takes payload object which contains the data to be sent to the server for the mutation 
        setPending(true); // immediatly sets the pending state to true, to indicate that the mutation is in progress
        return apiMutation(payload) //calls apiMutation and passes the payload, then sends the api request
            .finally(() => setPending(false)) //ensures that this callback is executed regardless of wheter the promise resolves successfully or is rejected with an error, in this case we set it to false to indicate that the mutation has finished 
            .then((result) => { //if the mutation succeeds the .then() method is triggered and it just receives the result from the api and simply returns it to the calling component
                return result;
            })
            .catch((error) => {
                throw error;
            });
    };

    return { //you return the actual function to call the mutation (mutate) and the pending state
        mutate,
        pending,
    };
};