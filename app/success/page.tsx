'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const name = searchParams.get('name') || '참가자';
  const cost = searchParams.get('cost') || '0';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 py-12 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto">
        {/* 성공 메시지 */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <svg
              className="w-20 h-20 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            신청이 완료되었습니다!
          </h1>
          <p className="text-lg text-gray-600">
            {name}님의 참가 신청이 정상적으로 접수되었습니다.
          </p>
        </div>

        {/* 입금 안내 */}
        <Card className="border-blue-200 bg-blue-50 mb-6">
          <CardHeader>
            <CardTitle className="text-blue-900">입금 안내</CardTitle>
            <CardDescription className="text-blue-700">
              아래 계좌로 참가비를 입금해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-700 mb-1">입금 금액</p>
              <p className="text-3xl font-bold text-blue-900">
                {parseInt(cost).toLocaleString('ko-KR')}원
              </p>
            </div>
            <div className="pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-700 mb-2">입금 계좌</p>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-lg font-semibold text-gray-900">
                  농협 356-0694-7937-13
                </p>
                <p className="text-sm text-gray-600">예금주: 김재환</p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm text-amber-700">
                ⚠️ 입금자명은 <strong>{name}</strong>으로 부탁드립니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 추가 안내사항 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>안내사항</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">💳</span>
              <p>입금 완료 시 참가 등록이 확정됩니다.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">📞</span>
              <p>문의사항은 셀장 또는 마을장에게 연락주세요.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">🚌</span>
              <p>
                이동 수단 및 일정 변경이 필요한 경우 반드시 셀장 또는 마을장에게 알려주세요.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 행사 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>2026 브릿지저스 겨울수련회</CardTitle>
            <CardDescription>청지기 - 청년이여, 지금 기도하라!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">일시:</span> 2026년 2월 5일(목) ~ 2월 7일(토)
            </div>
            <div>
              <span className="font-semibold">장소:</span> 경기 화성시 팔탄면 마당바위로 135-21 청호인재개발원
            </div>
            <div className="pt-3 text-xs text-gray-500 italic border-t mt-3">
              &ldquo;새벽 아직도 밝기 전에 예수께서 일어나 나가 한적한 곳으로 가사 거기서 기도하시더니&rdquo;
              <br />
              (마가복음 1:35)
            </div>
          </CardContent>
        </Card>

        {/* 홈으로 버튼 */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen p-4 py-12 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
