'use client';

import { useState, useEffect } from 'react';
import { RegistrationForm } from '@/components/registration-form';
import { Countdown } from '@/components/countdown';
import { isRegistrationOpen, getRegistrationOpenTime } from '@/lib/cost-calculator';
import Image from 'next/image';

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    // 클라이언트에서만 실행
    const checkRegistrationStatus = () => {
      setIsOpen(isRegistrationOpen());
    };

    checkRegistrationStatus();
    
    // 1초마다 확인
    const interval = setInterval(checkRegistrationStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  // 로딩 중
  if (isOpen === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </main>
    );
  }

  // 등록 오픈 전 - 카운트다운 표시
  if (!isOpen) {
    return <Countdown targetDate={getRegistrationOpenTime()} />;
  }

  // 등록 오픈 후 - 등록 폼 표시
  return (
    <main className="min-h-screen p-4 py-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          {/* 로고 */}
          <div className="flex justify-center">
            <Image 
              src="/BridgeJesusLogo.png" 
              alt="Bridge Jesus Logo" 
              width={180} 
              height={60}
              className="object-contain"
              priority
            />
          </div>
        </div>

        <RegistrationForm />
      </div>
    </main>
  );
}
