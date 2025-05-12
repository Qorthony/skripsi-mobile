type Request = {
    onStart?: () => void;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    onComplete?: () => void;
    endpoint: string;
    method?: string;
    body?: any;
    token?: string|null; // Token parameter untuk otentikasi
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
    onComplete,
    token
}: Request) => {
    
    try {
        // Periksa jika onStart ada sebelum memanggil
        if (onStart) onStart();
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        
        // Tambahkan header Authorization hanya jika token tersedia
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(apiUrl + endpoint, {
            method: method,
            headers,
            body: body ? JSON.stringify(body) : undefined, // Gunakan undefined daripada null
        });
    
        if (!res.ok) {
            throw new Error(`Response status: ${res.status}`);
        }
    
    const data = await res.json();
        if (onSuccess) onSuccess(data);
        return data; // Return data sehingga fungsi dapat digunakan dengan await
    } catch (error) {
        if (onError) onError(error);
        throw error; // Re-throw error untuk penanganan lebih lanjut
    } finally {
        if (onComplete) onComplete();
    }
};

export default BackendRequest;