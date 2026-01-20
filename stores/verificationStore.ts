import { create } from 'zustand';

export type VerificationStatus = 'idle' | 'pending' | 'success' | 'error';

export type SneakerVerification = {
  sneakerId: string;
  userId: string;
  status: VerificationStatus;
  verificationDate?: Date;
  method?: 'receipt' | 'qr';
};

interface VerificationState {
  verifications: Record<string, SneakerVerification>;
  currentVerification: SneakerVerification | null;
  loading: boolean;
  
  // Actions
  startVerification: (sneakerId: string, userId: string, method: 'receipt' | 'qr') => Promise<void>;
  getVerificationStatus: (sneakerId: string, userId: string) => SneakerVerification | null;
  isVerified: (sneakerId: string, userId: string) => boolean;
  getUserVerifiedSneakers: (userId: string) => string[];
}

/**
 * Verification store manages sneaker verification state
 * Implements mock verification flow with 2-second delay
 */
export const useVerificationStore = create<VerificationState>((set, get) => ({
  verifications: {},
  currentVerification: null,
  loading: false,

  startVerification: async (sneakerId: string, userId: string, method: 'receipt' | 'qr') => {
    const key = `${userId}-${sneakerId}`;
    
    // Set pending status
    const pendingVerification: SneakerVerification = {
      sneakerId,
      userId,
      status: 'pending',
      method
    };
    
    set({ 
      currentVerification: pendingVerification,
      loading: true,
      verifications: {
        ...get().verifications,
        [key]: pendingVerification
      }
    });

    // Simulate verification process with 2-second delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Set success status
    const successVerification: SneakerVerification = {
      sneakerId,
      userId,
      status: 'success',
      method,
      verificationDate: new Date()
    };

    set({
      currentVerification: successVerification,
      loading: false,
      verifications: {
        ...get().verifications,
        [key]: successVerification
      }
    });
  },

  getVerificationStatus: (sneakerId: string, userId: string) => {
    const key = `${userId}-${sneakerId}`;
    return get().verifications[key] || null;
  },

  isVerified: (sneakerId: string, userId: string) => {
    const verification = get().getVerificationStatus(sneakerId, userId);
    return verification?.status === 'success';
  },

  getUserVerifiedSneakers: (userId: string) => {
    const verifications = get().verifications;
    return Object.values(verifications)
      .filter(v => v.userId === userId && v.status === 'success')
      .map(v => v.sneakerId);
  }
}));
