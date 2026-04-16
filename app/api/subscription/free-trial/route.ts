import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const { data: activeSubscription } = await supabase
      .from('subscriptions')
      .select('id, plan_type')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (activeSubscription) {
      return NextResponse.json({ error: 'لديك اشتراك نشط بالفعل' }, { status: 400 })
    }

    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1)

    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_type: 'free',
        status: 'active',
        price: 0,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل النسخة المجانية لمدة شهر بنجاح',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
