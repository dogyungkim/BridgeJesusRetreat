'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface CountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // 시간이 지나면 페이지 새로고침
        window.location.reload();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) {
    return null; // 서버 렌더링 시 아무것도 표시하지 않음
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl w-full">
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
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-center text-2xl md:text-2xl whitespace-nowrap">
              2026 브릿지저스 겨울수련회 ☃️💙
            </CardTitle>
            <p className="text-lg md:text-xl mt-2 text-blue-600 font-semibold">
              청지기 (청년이여, 지금 기도하라!)
            </p>
            {/* 수련회 정보 */}
            <div className="text-center space-y-2 pb-4 border-b">
              <p className="text-base text-gray-700">🗓️ 일정: 2026년 2월 5일(목) ~ 2월 7일(토)</p>
              <p className="text-base text-gray-700">📍 장소: 경기 화성시 팔탄면 마당바위로 135-21 청호인재개발원</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pb-8">
            {/* 등록 오픈 안내 */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 shadow-md">
              <p className="text-center text-lg font-semibold text-blue-900 mb-4">
                🎉 등록이 곧 시작됩니다!
              </p>
              <p className="text-center text-gray-700 mb-2">
                <span className="font-bold">2026년 1월 18일(토) 오후 6시</span>부터
              </p>
              <p className="text-center text-gray-700 mb-6">
                신청이 시작됩니다
              </p>

              {/* 카운트다운 */}
              <div className="grid grid-cols-4 gap-1 md:gap-3 max-w-md mx-auto">
                {[
                  { label: '일', value: timeLeft.days },
                  { label: '시간', value: timeLeft.hours },
                  { label: '분', value: timeLeft.minutes },
                  { label: '초', value: timeLeft.seconds },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-lg p-2 md:p-4 shadow-md border-2 border-blue-100 flex items-center justify-center gap-1"
                  >
                    <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-0.5 md:mb-1">
                      {String(item.value).padStart(1, '0')}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 얼리버드 안내 */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2 text-center">
                ⭐ 얼리버드 할인 혜택
              </p>
              <div className="text-sm text-amber-800 space-y-1">
                <p className="text-center">
                  <span className="font-semibold">1월 18일 ~ 1월 25일</span> 신청 시
                </p>
                <p className="text-center">
                  전일 참석 <span className="font-bold text-lg">100,000원</span>
                  <span className="text-xs text-gray-600 line-through ml-2">120,000원</span>
                </p>
              </div>
            </div>

            {/* 추가 안내 */}
            <div className="text-center text-sm text-gray-600 space-y-1">
              <p>🔖 이 페이지를 북마크해두세요!</p>
              <p>⏰ 시작 시간에 자동으로 신청 폼이 열립니다</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
