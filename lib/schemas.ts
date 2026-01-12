import { z } from 'zod';

// 또래 옵션
export const AGE_GROUPS = [
  '90+', '91', '92', '93', '94', '95', '96', '97', '98', '99', 
  '00'
] as const;

// 마을 옵션
export const VILLAGES = [
  '두인럽마을',
  '두팔마을',
  '밝은마을',
  '셀럽마을',
  '위너마을',
  '조이마을',
  '토브마을',
  '샬롬마을(새가족)',
  '없음',
] as const;

// 성별 옵션
export const GENDERS = ['남', '여'] as const;

// 참석 유형
export const ATTENDANCE_TYPES = ['full', 'partial'] as const;

// 전일 참석 이동 수단
export const FULL_TRANSPORT_TYPES = [
  '대형버스를 이용한 본대 이동',
  '자차 (카풀 가능)',
  '자차 (카풀 어려움)',
  '카풀 필요',
] as const;

// 부분 참석 이동 수단
export const PARTIAL_TRANSPORT_TYPES = [
  '자차 (카풀 가능)',
  '자차 (카풀 어려움)',
  '카풀 필요',
] as const;

// 참석 날짜
export const ATTENDANCE_DAYS = ['day1', 'day2', 'day3'] as const;

// 전화번호 포맷 함수
export function formatPhoneNumber(phone: string): string {
  const numbers = phone.replace(/[^0-9]/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  if (numbers.length === 10) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  return numbers;
}

// 기본 정보 스키마
const baseInfoSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  ageGroup: z.enum(AGE_GROUPS, {
    message: '또래를 선택해주세요',
  }),
  gender: z.enum(GENDERS, {
    message: '성별을 선택해주세요',
  }),
  village: z.enum(VILLAGES, {
    message: '마을을 선택해주세요',
  }),
  phone: z
    .string()
    .min(1, '연락처를 입력해주세요')
    .transform(formatPhoneNumber)
    .refine(
      (val) => /^\d{3}-\d{3,4}-\d{4}$/.test(val),
      '올바른 전화번호 형식이 아닙니다'
    ),
  requests: z.string().optional(),
});

// 전일 참석 스키마
const fullAttendanceSchema = z.object({
  attendanceType: z.literal('full'),
  transportType: z.enum(FULL_TRANSPORT_TYPES, {
    message: '이동 수단을 선택해주세요',
  }),
  departureInfo: z.string().optional(),
  returnInfo: z.string().optional(),
}).superRefine((data, ctx) => {
  // 자차 또는 카풀 필요 선택 시 출발/귀가 정보 필수
  const needsTransportInfo = data.transportType.includes('자차') || data.transportType === '카풀 필요';
  
  if (needsTransportInfo) {
    if (!data.departureInfo || data.departureInfo.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '출발 정보를 입력해주세요 (예: 1일차 18시 동백역)',
        path: ['departureInfo'],
      });
    }
    if (!data.returnInfo || data.returnInfo.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '귀가 정보를 입력해주세요 (예: 3일차 집회 후 동백역)',
        path: ['returnInfo'],
      });
    }
  }
});

// 부분 참석 스키마
const partialAttendanceSchema = z.object({
  attendanceType: z.literal('partial'),
  attendanceDates: z
    .array(z.enum(ATTENDANCE_DAYS))
    .min(1, '최소 1일 이상 선택해주세요'),
  transportType: z.enum(PARTIAL_TRANSPORT_TYPES, {
    message: '이동 방법을 선택해주세요',
  }),
  departureInfo: z.string().optional(),
  returnInfo: z.string().optional(),
}).superRefine((data, ctx) => {
  // 자차 또는 카풀 필요 선택 시 출발/귀가 정보 필수
  const needsTransportInfo = data.transportType.includes('자차') || data.transportType === '카풀 필요';
  
  if (needsTransportInfo) {
    if (!data.departureInfo || data.departureInfo.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '출발 정보를 입력해주세요 (예: 1일차 18시 동백역)',
        path: ['departureInfo'],
      });
    }
    if (!data.returnInfo || data.returnInfo.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '귀가 정보를 입력해주세요 (예: 3일차 집회 후 동백역)',
        path: ['returnInfo'],
      });
    }
  }
});

// 최종 등록 폼 스키마
export const registrationSchema = z.intersection(
  baseInfoSchema,
  z.discriminatedUnion('attendanceType', [
    fullAttendanceSchema,
    partialAttendanceSchema,
  ])
);

export type RegistrationFormData = z.infer<typeof registrationSchema>;
