import { NextResponse } from 'next/server';
import { supabase } from '../../../supabaseClient';

export async function GET() {
    const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('timestamp', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
