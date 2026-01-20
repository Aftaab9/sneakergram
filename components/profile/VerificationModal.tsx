'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useVerificationStore } from '@/stores/verificationStore';
import { Sneaker } from '@/types';
import { Upload, QrCode, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sneaker: Sneaker;
  userId: string;
}

/**
 * VerificationModal component handles sneaker verification flow
 * 
 * @example
 * ```tsx
 * <VerificationModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   sneaker={selectedSneaker}
 *   userId={currentUser.id}
 * />
 * ```
 */
export function VerificationModal({ 
  isOpen, 
  onClose, 
  sneaker,
  userId 
}: VerificationModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'receipt' | 'qr' | null>(null);
  const { startVerification, currentVerification, loading } = useVerificationStore();

  const handleVerify = async (method: 'receipt' | 'qr') => {
    setSelectedMethod(method);
    await startVerification(sneaker.id, userId, method);
  };

  const handleClose = () => {
    setSelectedMethod(null);
    onClose();
  };

  const isSuccess = currentVerification?.status === 'success' && 
                    currentVerification?.sneakerId === sneaker.id;
  const isPending = currentVerification?.status === 'pending' && 
                    currentVerification?.sneakerId === sneaker.id;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Verify Sneaker">
      <div className="space-y-6">
        {/* Sneaker Info */}
        <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
            <Image
              src={sneaker.images[0]}
              alt={`${sneaker.brand} ${sneaker.model}`}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400">{sneaker.brand}</p>
            <h3 className="text-lg font-semibold text-foreground">{sneaker.model}</h3>
            <p className="text-sm text-gray-500">{sneaker.colorway}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Success State */}
          {isSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4"
              >
                <CheckCircle size={48} className="text-green-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Verification Complete!
              </h3>
              <p className="text-gray-400 mb-6">
                Your sneaker has been successfully verified
              </p>
              <Button variant="primary" onClick={handleClose}>
                Done
              </Button>
            </motion.div>
          )}

          {/* Pending State */}
          {isPending && (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <LoadingSpinner size="lg" />
              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">
                Verifying Sneaker...
              </h3>
              <p className="text-gray-400">
                Please wait while we verify your {selectedMethod === 'receipt' ? 'receipt' : 'QR code'}
              </p>
            </motion.div>
          )}

          {/* Method Selection */}
          {!isPending && !isSuccess && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <p className="text-gray-400 text-center mb-6">
                Choose a verification method to authenticate your sneaker
              </p>

              {/* Upload Receipt Option */}
              <button
                onClick={() => handleVerify('receipt')}
                disabled={loading}
                className="w-full p-6 bg-card border-2 border-border rounded-lg hover:border-primary transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Upload size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground mb-1">
                      Upload Receipt
                    </h4>
                    <p className="text-sm text-gray-400">
                      Upload a photo of your purchase receipt or proof of authenticity
                    </p>
                  </div>
                </div>
              </button>

              {/* Scan QR Code Option */}
              <button
                onClick={() => handleVerify('qr')}
                disabled={loading}
                className="w-full p-6 bg-card border-2 border-border rounded-lg hover:border-primary transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <QrCode size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground mb-1">
                      Scan QR Code
                    </h4>
                    <p className="text-sm text-gray-400">
                      Scan the authentication QR code on your sneaker box or tag
                    </p>
                  </div>
                </div>
              </button>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-gray-500 text-center">
                  Verification typically takes 24-48 hours. For demo purposes, verification is instant.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
