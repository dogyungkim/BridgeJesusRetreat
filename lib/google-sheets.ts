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
        'Day1(목)',
        'Day2(금)',
        'Day3(토)',
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

    // 각 날짜별 참석 여부 계산 (전일 참석이면 모두 O, 부분 참석이면 선택된 날짜만 O)
    let day1 = 'X';
    let day2 = 'X';
    let day3 = 'X';
    
    if (data.attendanceType === 'full') {
      day1 = 'O';
      day2 = 'O';
      day3 = 'O';
    } else if (data.attendanceDates && data.attendanceDates.length > 0) {
      if (data.attendanceDates.includes('day1')) day1 = 'O';
      if (data.attendanceDates.includes('day2')) day2 = 'O';
      if (data.attendanceDates.includes('day3')) day3 = 'O';
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
      'Day1(목)': day1,
      'Day2(금)': day2,
      'Day3(토)': day3,
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
