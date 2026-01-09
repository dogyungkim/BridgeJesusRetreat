import { RegistrationForm } from '@/components/registration-form';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen p-4 py-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          {/* 로고 */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/BridgeJesusLogo.png" 
              alt="Bridge Jesus Logo" 
              width={180} 
              height={60}
              className="object-contain"
              priority
            />
          </div>
          
          <h1 className="text-4xl font-bold mb-2">
            2026 브릿지저스 겨울수련회 신청 폼
          </h1>
        </div>

        <RegistrationForm />
      </div>
    </main>
  );
}
