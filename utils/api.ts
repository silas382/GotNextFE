// API service for backend communication
// Backend runs on localhost:8080 with base path /api/queue
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/queue';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface PlayerEntry {
  id: number;
  name: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = options.method || 'GET';
    console.log(`\n[API] ========================================`);
    console.log(`[API] ${method} Request`);
    console.log(`[API] URL: ${url}`);
    console.log(`[API] Method: ${method}`);
    console.log(`[API] Headers:`, { 'Content-Type': 'application/json', ...options.headers });
    console.log(`[API] ========================================\n`);
    
    try {
      // For POST requests with query params, don't send Content-Type: application/json
      // Spring Boot @RequestParam expects form data or query params, not JSON body
      // For DELETE requests, also don't set Content-Type (backend uses @PathVariable)
      const headers: Record<string, string> = {};
      if ((method === 'POST' && url.includes('?')) || method === 'DELETE') {
        // POST with query params or DELETE - don't set Content-Type, let browser set it
        // This allows Spring Boot to read @RequestParam/@PathVariable correctly
      } else {
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(url, {
        method: method,
        headers: {
          ...headers,
          ...options.headers,
        },
        ...options,
      });

      console.log(`[API] Response received:`);
      console.log(`[API] Status: ${response.status} ${response.statusText}`);
      console.log(`[API] Status OK: ${response.ok}`);
      console.log(`[API] Headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] ❌ ERROR - Status ${response.status}`);
        console.error(`[API] Error response body:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      let data;
      // DELETE endpoint returns ResponseEntity<String> which is plain text, not JSON
      if (method === 'DELETE') {
        const text = await response.text();
        console.log(`[API] ✅ DELETE Response:`, text);
        data = text;
      } else if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log(`[API] ✅ SUCCESS - JSON Response:`, data);
      } else {
        const text = await response.text();
        console.log(`[API] ⚠️  Non-JSON response:`, text);
        data = text;
      }
      
      return { data };
    } catch (error) {
      console.error(`[API] ❌ REQUEST FAILED:`);
      console.error(`[API] Error type:`, error instanceof Error ? error.constructor.name : typeof error);
      console.error(`[API] Error message:`, error instanceof Error ? error.message : String(error));
      console.error(`[API] Full error:`, error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error(`[API] 🔴 NETWORK ERROR - Check if backend is running at: ${API_BASE_URL}`);
        console.error(`[API] Make sure:`);
        console.error(`[API] 1. Backend server is running on port 8080`);
        console.error(`[API] 2. CORS is configured to allow requests from frontend`);
        console.error(`[API] 3. No firewall is blocking the connection`);
      }
      
      return {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // Add player to queue
  // Backend: @PostMapping("/add") with @RequestParam String name
  // Endpoint: POST /api/queue/add?name={name}
  async addPlayer(name: string): Promise<ApiResponse<PlayerEntry>> {
    if (!name || name.trim() === '') {
      console.error('[API] Cannot add player: name is empty');
      return { error: 'Player name cannot be empty' };
    }

    const endpoint = `/add?name=${encodeURIComponent(name.trim())}`;
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    
    console.log('\n=== ADDING PLAYER TO BACKEND ===');
    console.log('Player name:', name);
    console.log('Endpoint:', endpoint);
    console.log('Full URL:', fullUrl);
    console.log('API Base URL:', API_BASE_URL);
    
    try {
      const result = await this.request<PlayerEntry>(endpoint, {
        method: 'POST',
      });
      
      console.log('=== ADD PLAYER RESULT ===');
      console.log('Success:', !result.error);
      console.log('Data:', result.data);
      console.log('Error:', result.error);
      
      if (result.error) {
        console.error('❌ Failed to add player to backend queue');
      } else {
        console.log('✅ Successfully added player to backend queue');
        // Verify by fetching queue
        const queueResult = await this.getQueue();
        console.log('Current queue after add:', queueResult.data);
      }
      
      return result;
    } catch (error) {
      console.error('=== EXCEPTION IN addPlayer ===', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get queue
  // Backend: @GetMapping at base path
  // Endpoint: GET /api/queue
  async getQueue(): Promise<ApiResponse<PlayerEntry[]>> {
    return this.request<PlayerEntry[]>('');
  }

  // Delete player
  // Backend: @DeleteMapping("/{id}") with @PathVariable Long id
  // Endpoint: DELETE /api/queue/{id}
  async deletePlayer(id: number): Promise<ApiResponse<string>> {
    if (!id || id <= 0) {
      console.error('[API] Cannot delete player: invalid ID', id);
      return { error: 'Player ID must be a positive number' };
    }

    console.log('\n=== DELETING PLAYER FROM BACKEND ===');
    console.log('Player ID to delete:', id);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Endpoint: /' + id);
    console.log('Full URL will be:', `${API_BASE_URL}/${id}`);
    console.log('Expected backend endpoint: DELETE http://localhost:8080/api/queue/' + id);
    
    const endpoint = `/${id}`;
    const result = await this.request<string>(endpoint, {
      method: 'DELETE',
    });
    
    console.log('\n=== DELETE RESULT ===');
    console.log('Success:', !result.error);
    console.log('Has error:', !!result.error);
    console.log('Error:', result.error);
    console.log('Data:', result.data);
    console.log('Full result:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('❌ DELETE FAILED - Player will still be in backend queue!');
    } else {
      console.log('✅ DELETE SUCCEEDED - Player should be removed from backend queue');
    }
    
    return result;
  }
}

export const apiService = new ApiService();

