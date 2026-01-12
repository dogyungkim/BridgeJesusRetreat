'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  registrationSchema, 
  type RegistrationFormData,
  AGE_GROUPS,
  VILLAGES,
  GENDERS,
  FULL_TRANSPORT_TYPES,
  PARTIAL_TRANSPORT_TYPES,
  ATTENDANCE_DAYS,
} from '@/lib/schemas';
import { calculateTotalCost, formatCurrency, isEarlyBird } from '@/lib/cost-calculator';
import { useRouter } from 'next/navigation';

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const router = useRouter();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      ageGroup: '00',
      gender: '남',
      village: '없음',
      phone: '',
      requests: '',
      attendanceType: 'full',
      transportType: '대형버스를 이용한 본대 이동',
    },
  });

  const attendanceType = form.watch('attendanceType');
  const attendanceDates = form.watch('attendanceDates');

  // 비용 계산
  const calculatedCost = calculateTotalCost(
    attendanceType,
    attendanceDates
  );

  const isEarlyBirdPeriod = isEarlyBird();

  const onSubmit = async (data: RegistrationFormData) => {

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          totalCost: calculatedCost,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '신청 중 오류가 발생했습니다');
      }

      const result = await response.json();
      
      // 성공 페이지로 이동 (등록 정보 전달)
      router.push(`/success?cost=${calculatedCost}&name=${encodeURIComponent(data.name)}&village=${encodeURIComponent(data.village)}`);
    } catch (error) {
      console.error('Registration error:', error);
      alert(error instanceof Error ? error.message : '신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        {/* 행사 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl md:text-2xl whitespace-nowrap">2026 브릿지저스 겨울수련회 ☃️💙</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center space-y-2">
              <p className="text-base">💌 주제: 청지기 (청년이여, 지금 기도하라!)</p>
              <p className="text-base">🗓️ 일정: 2026년 2월 5일(목) ~ 2월 7일(토)</p>
              <p className="text-base">📍 장소: 경기 화성시 팔탄면 마당바위로 135-21 청호인재개발원</p>
            </div>

            {/* 참가비 안내 */}
            <div className="pt-2 border-t">
              <p className="font-semibold text-gray-900 mb-2">참가비</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">▪️</span>
                  <span className={isEarlyBirdPeriod ? "text-blue-600 font-medium" : "text-gray-600"}>
                    얼리버드: 2026년 1월 18일(주일) ~ 1월 25일(주일) → 전참 100,000원
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">▪️</span>
                  <span className="text-gray-600">
                    본등록: 2026년 1월 26일(월) ~ 2월 1일(주일) → 전참 120,000원
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">▪️</span>
                  <span className="text-gray-600">
                    부분참석비: 목요일 50,000원 / 금요일 50,000원 / 토요일 20,000원
                  </span>
                </div>
              </div>
              {isEarlyBirdPeriod && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">
                  🎉 현재 얼리버드 기간입니다! (~ 1월 25일)
                </p>
              </div>
            )}
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-sm font-bold text-red-600">
                  ⚠️ 부분참석은 숙박여부, 참여시간과 관계없이 수련회에 참여하는 일수로 계산됩니다.
                </p>
              </div>
            </div>


          </CardContent>
        </Card>

        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름 *</FormLabel>
                  <FormControl>
                    <Input placeholder="홍길동" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ageGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>또래 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="또래를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AGE_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>성별 *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-3"
                    >
                      {GENDERS.map((gender) => (
                        <label 
                          key={gender}
                          className="border-2 rounded-lg px-6 py-3 cursor-pointer hover:bg-gray-50 transition-all flex-1 block"
                          style={{
                            borderColor: field.value === gender ? 'rgb(37 99 235)' : 'rgb(229 231 235)',
                            backgroundColor: field.value === gender ? 'rgb(239 246 255)' : 'transparent'
                          }}
                        >
                          <FormItem className="flex items-center justify-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={gender} className="w-5 h-5" />
                            </FormControl>
                            <div className="font-normal">
                              {gender}
                            </div>
                          </FormItem>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="village"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>마을 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="마을을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {VILLAGES.map((village) => (
                        <SelectItem key={village} value={village}>
                          {village}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => {
                // 전화번호 포맷팅 함수
                const formatPhoneNumber = (value: string) => {
                  const numbers = value.replace(/[^0-9]/g, '');
                  if (numbers.length <= 3) {
                    return numbers;
                  } else if (numbers.length <= 7) {
                    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
                  } else if (numbers.length <= 11) {
                    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
                  }
                  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
                };

                return (
                  <FormItem>
                    <FormLabel>연락처 *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="010-1234-5678" 
                        value={formatPhoneNumber(field.value || '')}
                        onChange={(e) => {
                          const numbers = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(numbers);
                        }}
                      />
                    </FormControl>
                    <FormDescription>숫자만 입력하세요 (자동으로 - 포함됩니다)</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="requests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>추가 요청 사항</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="음식 알러지, 건강 상태, 기타 요청 사항을 입력해주세요"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 참석 일정 선택 */}
        <Card>
          <CardHeader>
            <CardTitle>참석 일정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 얼리버드 할인 안내 */}
            {isEarlyBirdPeriod && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">
                  🎉 얼리버드 할인 적용 중!
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  1월 25일까지 전일 참석 시 20,000원 할인 (100,000원)
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="attendanceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>참석 유형 *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        // 참석 유형 변경 시 이동 수단 초기화
                        if (value === 'full') {
                          form.setValue('transportType', '대형버스를 이용한 본대 이동');
                        } else {
                          form.setValue('transportType', '자차 (카풀 가능)');
                        }
                      }}
                      defaultValue={field.value}
                      className="flex flex-col gap-3"
                    >
                      {/* 전일 참석 */}
                      <label 
                        className="border-2 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all block"
                        style={{
                          borderColor: field.value === 'full' ? 'rgb(37 99 235)' : 'rgb(229 231 235)',
                          backgroundColor: field.value === 'full' ? 'rgb(239 246 255)' : 'transparent'
                        }}
                      >
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                              value="full" 
                              className="w-5 h-5 mt-0.5"
                              onClick={() => {
                                field.onChange('full');
                                form.setValue('transportType', '대형버스를 이용한 본대 이동');
                              }}
                            />
                          </FormControl>
                          <div className="font-normal flex-1">
                            <div>전일 참석 (2박 3일)</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {isEarlyBirdPeriod ? (
                                <>
                                  <span className="font-semibold text-blue-600">100,000원</span>
                                  <span className="text-xs line-through ml-1">120,000원</span>
                                </>
                              ) : (
                                <span className="font-semibold">120,000원</span>
                              )}
                            </div>
                          </div>
                        </FormItem>
                      </label>

                      {/* 부분 참석 */}
                      <label 
                        className="border-2 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all block"
                        style={{
                          borderColor: field.value === 'partial' ? 'rgb(37 99 235)' : 'rgb(229 231 235)',
                          backgroundColor: field.value === 'partial' ? 'rgb(239 246 255)' : 'transparent'
                        }}
                      >
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                              value="partial" 
                              className="w-5 h-5 mt-0.5"
                              onClick={() => {
                                field.onChange('partial');
                                form.setValue('transportType', '자차 (카풀 가능)');
                              }}
                            />
                          </FormControl>
                          <div className="font-normal flex-1">
                            <div>부분 참석</div>
                            <div className="text-sm text-gray-600 mt-1">
                              목: 50,000원 / 금: 50,000원 / 토: 20,000원
                            </div>
                          </div>
                        </FormItem>
                      </label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 부분 참석 시 날짜 선택 */}
            {attendanceType === 'partial' && (
              <FormField
                control={form.control}
                name="attendanceDates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>참석 날짜 선택 *</FormLabel>
                    <div className="space-y-2">
                      {[
                        { value: 'day1', label: '1일차 (목요일)' },
                        { value: 'day2', label: '2일차 (금요일)' },
                        { value: 'day3', label: '3일차 (토요일)' },
                      ].map((day) => {
                        const isChecked = field.value?.includes(day.value as any) || false;
                        return (
                          <label 
                            key={day.value}
                            className="border rounded-lg px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-all flex items-center space-x-3 block"
                            style={{
                              borderColor: isChecked ? 'rgb(191 219 254)' : 'rgb(229 231 235)',
                              backgroundColor: isChecked ? 'rgb(239 246 255)' : 'transparent'
                            }}
                          >
                            <input
                              type="checkbox"
                              id={day.value}
                              checked={isChecked}
                              onChange={(e) => {
                                const currentValue = field.value || [];
                                if (e.target.checked) {
                                  field.onChange([...currentValue, day.value]);
                                } else {
                                  field.onChange(currentValue.filter((v) => v !== day.value));
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-normal flex-1">
                              {day.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 이동 수단 */}
            <FormField
              control={form.control}
              name="transportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이동 수단 *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col gap-3"
                    >
                      {(attendanceType === 'full' 
                        ? FULL_TRANSPORT_TYPES 
                        : PARTIAL_TRANSPORT_TYPES
                      ).map((transport) => (
                        <label 
                          key={transport}
                          className="border-2 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all block"
                          style={{
                            borderColor: field.value === transport ? 'rgb(37 99 235)' : 'rgb(229 231 235)',
                            backgroundColor: field.value === transport ? 'rgb(239 246 255)' : 'transparent'
                          }}
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={transport} className="w-5 h-5" />
                            </FormControl>
                            <div className="font-normal flex-1">
                              {transport}
                            </div>
                          </FormItem>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 자차 또는 카풀 필요 선택 시 출발/귀가 정보 */}
            {(form.watch('transportType')?.includes('자차') || form.watch('transportType')?.includes('카풀')) && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <p className="text-sm text-blue-900">
                    ℹ️ 카풀 매칭을 위해 출발 및 귀가 정보를 꼭 입력해주세요
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="departureInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>출발 정보 *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="예: 1일차 18시 동백역" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        언제 / 어디서 수련회 장소로 출발하는지 입력해주세요
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="returnInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>귀가 정보 *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="예: 3일차 집회 후 동백역" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        언제 / 어디로 귀가하는지 입력해주세요
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-700">
                    ⚠️ 변경 사항 발생 시 셀장 또는 마을장에게 연락해주세요
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 참가비 안내 */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">참가비</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(calculatedCost)}</p>
              <p className="text-sm text-gray-700">
                입금 계좌: 농협 356-0694-7937-13 김재환
              </p>
              <p className="text-xs text-gray-600">
                신청 후 입금 완료 시 참가 등록이 확정됩니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <Button 
          type="submit" 
          className="w-full h-12 text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? '신청 중...' : '참가 신청하기'}
        </Button>
      </form>
    </Form>
  );
}
