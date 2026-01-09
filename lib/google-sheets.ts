import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

/**
 * Google Sheets 클라이언트 초기화
 */
export async function getGoogleSheet() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID!,
    serviceAccountAuth
  );

  await doc.loadInfo();
  return doc;
}

/**
 * 신청 데이터를 Google Sheets에 추가
 */
export async function appendToSheet(data: {
  id: number;
  createdAt: string;
  name: string;
  ageGroup: string;
  gender: string;
  village: string;
  phone: string;
  requests?: string;
  attendanceType: string;
  attendanceDates?: string[];
  transportType: string;
  departureInfo?: string;
  returnInfo?: string;
  totalCost: number;
  status: string;
}) {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByIndex[0]; // 첫 번째 시트 사용

    // 헤더가 없으면 생성
    try {
      await sheet.loadHeaderRow();
    } catch (error) {
      // 헤더가 없는 경우 생성
      await sheet.setHeaderRow([
        '신청일시',
        '이름',
        '또래',
        '성별',
        '마을',
        '연락처',
        '추가요청',
        '참석유형',
        '참석날짜',
        '이동수단',
        '출발정보',
        '귀가정보',
        '참가비',
      ]);
    }

    // 날짜를 한국 시간대 기준 "YYYY-MM-DD HH:mm" 형식으로 변환
    const formatDateTime = (isoString: string): string => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    // 참석 날짜 포맷 (전일 참석이면 day1, day2, day3 자동 입력)
    let attendanceDatesStr = '';
    if (data.attendanceType === 'full') {
      attendanceDatesStr = 'day1, day2, day3';
    } else if (data.attendanceDates && data.attendanceDates.length > 0) {
      attendanceDatesStr = data.attendanceDates.join(', ');
    }

    // 데이터 추가
    await sheet.addRow({
      신청일시: formatDateTime(data.createdAt),
      이름: data.name,
      또래: data.ageGroup,
      성별: data.gender,
      마을: data.village,
      연락처: data.phone,
      추가요청: data.requests || '',
      참석유형: data.attendanceType === 'full' ? '전일참석' : '부분참석',
      참석날짜: attendanceDatesStr,
      이동수단: data.transportType,
      출발정보: data.departureInfo || '',
      귀가정보: data.returnInfo || '',
      참가비: data.totalCost,
    });

    return { success: true };
  } catch (error) {
    console.error('Google Sheets 오류:', error);
    throw error;
  }
}
