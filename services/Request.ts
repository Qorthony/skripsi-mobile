import { useSession } from "@/hooks/auth/ctx";

type Request = {
    onStart: () => void;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
    onComplete: () => void;
    endpoint: string;
    method?: string;
    body?: any;
};

const apiUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

const BackendRequest = async (
{ 
    endpoint, 
    method = 'GET', 
    body,
    onStart, 
    onSuccess, 
    onError, 
    onComplete 
}: Request) => {

    const { session } = useSession();
    
    try {
        onStart();
        const res = await fetch(apiUrl + endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${session}`,
            },
            body: body ? JSON.stringify(body) : null,
        });
    
        if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
        }
    
        const data = await res.json();
        onSuccess(data);
    } catch (error) {
        onError(error);
    } finally {
        onComplete();
    }
};

export default BackendRequest;