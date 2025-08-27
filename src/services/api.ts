const BASE_URL = 'https://staging.backend.watt-pay.com/api/auth';

export const API_ENDPOINTS = {
  signin: `${BASE_URL}/signin`,
  signup: `${BASE_URL}/signup`,
  forgotPassword: `${BASE_URL}/forgot-password`,
  verifyOtp: `${BASE_URL}/verify-otp`,
  resetPassword: `${BASE_URL}/reset-password`,
  financers: 'https://staging.backend.watt-pay.com/api/financiers',
  processesByFinancier: 'https://staging.backend.watt-pay.com/api/financier-process-stages/financier',
  uploadPdfV2: 'http://192.168.0.193:8099/api/qcell/m2/upload_pdf_v2/'
};

export interface AuthResponse {
  token?: string;
  access_token?: string;
  jwt?: string;
  authToken?: string;
  message?: string;
}

export interface Financer {
  id: string;
  name: string;
}

export interface Process {
  processStageId: string;
  processStageName: string;
}

export const authService = {
  async signin(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(API_ENDPOINTS.signin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  },

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(API_ENDPOINTS.signup, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      throw new Error(`Signup failed: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    const response = await fetch(API_ENDPOINTS.forgotPassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error(`Forgot password failed: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  },

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    const response = await fetch(API_ENDPOINTS.verifyOtp, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp })
    });

    if (!response.ok) {
      throw new Error(`OTP verification failed: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  },

  async resetPassword(email: string, password: string, token?: string): Promise<AuthResponse> {
    const response = await fetch(API_ENDPOINTS.resetPassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, token })
    });

    if (!response.ok) {
      throw new Error(`Reset password failed: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }
};

export const dataService = {
  async getFinancers(): Promise<Financer[]> {
    const response = await fetch(API_ENDPOINTS.financers);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch financers: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  },

  async getProcessesByFinancier(financierId: string): Promise<Process[]> {
    const response = await fetch(`${API_ENDPOINTS.processesByFinancier}/${financierId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch processes: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  },

  async submitWattpayRequest(data: {
    financer: string;
    process: string;
    userId: string;
    combinedPdf: string;
  }): Promise<any> {
    const formData = new FormData();
    formData.append('Financier', data.financer);
    formData.append('Process', data.process);
    formData.append('user_id', data.userId);
    formData.append('combined_pdf', data.combinedPdf);

    const response = await fetch(API_ENDPOINTS.uploadPdfV2, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Submission failed: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }
};