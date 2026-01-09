import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/schemas';
import { calculateTotalCost } from '@/lib/cost-calculator';
import { getServiceSupabase } from '@/lib/supabase';
import { appendToSheet } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 데이터 유효성 검증
    const validatedData = registrationSchema.parse(body);

    // 비용 재계산 (클라이언트 값 검증)
    const totalCost = calculateTotalCost(
      validatedData.attendanceType,
      validatedData.attendanceType === 'partial' ? validatedData.attendanceDates : undefined
    );

    // Supabase 클라이언트
    const supabase = getServiceSupabase();
    
    // 중복 신청 체크 (이름 + 전화번호)
    const { data: existingRegistrations, error: checkError } = await supabase
      .from('registrations')
      .select('id, name, phone')
      .eq('name', validatedData.name)
      .eq('phone', validatedData.phone);
    
    if (checkError) {
      console.error('Duplicate check error:', checkError);
      // 체크 실패 시에도 진행 (로그만 남김)
    }
    
    if (existingRegistrations && existingRegistrations.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: '이미 동일한 이름과 전화번호로 신청된 내역이 있습니다. 중복 신청은 불가합니다.',
        },
        { status: 409 }
      );
    }
    
    const { data: registration, error: dbError } = await supabase
      .from('registrations')
      .insert({
        name: validatedData.name,
        age_group: validatedData.ageGroup,
        gender: validatedData.gender,
        village: validatedData.village,
        phone: validatedData.phone,
        requests: validatedData.requests || null,
        attendance_type: validatedData.attendanceType,
        attendance_dates: validatedData.attendanceType === 'partial' ? validatedData.attendanceDates : null,
        transport_type: validatedData.transportType,
        departure_info: validatedData.departureInfo || null,
        return_info: validatedData.returnInfo || null,
        total_cost: totalCost,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('데이터베이스 저장 중 오류가 발생했습니다');
    }

    // Google Sheets에 추가 (비동기, 실패해도 진행)
    try {
      await appendToSheet({
        id: registration.id,
        createdAt: registration.created_at,
        name: validatedData.name,
        ageGroup: validatedData.ageGroup,
        gender: validatedData.gender,
        village: validatedData.village,
        phone: validatedData.phone,
        requests: validatedData.requests,
        attendanceType: validatedData.attendanceType,
        attendanceDates: validatedData.attendanceType === 'partial' ? validatedData.attendanceDates : undefined,
        transportType: validatedData.transportType,
        departureInfo: validatedData.departureInfo,
        returnInfo: validatedData.returnInfo,
        totalCost: totalCost,
        status: 'pending',
      });
    } catch (sheetError) {
      console.error('Google Sheets 동기화 실패 (계속 진행):', sheetError);
      // 실패해도 신청은 완료된 것으로 처리
    }

    return NextResponse.json(
      {
        success: true,
        message: '신청이 완료되었습니다',
        data: {
          id: registration.id,
          name: validatedData.name,
          totalCost: totalCost,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: '신청 처리 중 오류가 발생했습니다',
      },
      { status: 500 }
    );
  }
}
