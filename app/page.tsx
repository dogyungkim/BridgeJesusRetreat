import { RegistrationForm } from '@/components/registration-form';

export default function Home() {
  return (
    <main className="min-h-screen p-4 py-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            2026 브릿지저스 겨울수련회
          </h1>
          <p className="text-xl text-gray-700 mb-1">청지기</p>
          <p className="text-lg text-gray-600 mb-4">청년이여, 지금 기도하라!</p>
          <p className="text-sm text-gray-500 italic">
            &ldquo;새벽 아직도 밝기 전에 예수께서 일어나 나가 한적한 곳으로 가사 거기서 기도하시더니&rdquo; (마가복음 1:35)
          </p>
        </div>

        <RegistrationForm />
      </div>
    </main>
  );
}
