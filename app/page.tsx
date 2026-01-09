import { RegistrationForm } from '@/components/registration-form';
import Image from 'next/image';

export default function Home() {
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
