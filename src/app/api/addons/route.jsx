// app/api/addons/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🔍 API Addons called');
  
  try {
    // Las variables de next.config.js están disponibles en el servidor
    const API_KEY = process.env.CURSEFORGE_API_KEY;
    const CF_URI = process.env.CF_URI;

    console.log('📋 Config variables:', {
      hasApiKey: !!API_KEY,
      hasUri: !!CF_URI,
      uri: CF_URI || 'Missing'
    });

    if (!API_KEY) {
      return NextResponse.json(
        { error: "CURSEFORGE_API_KEY no configurada en next.config.js" },
        { status: 500 }
      );
    }

    if (!CF_URI) {
      return NextResponse.json(
        { error: "CF_URI no configurada en next.config.js" },
        { status: 500 }
      );
    }

    console.log('🌐 Making request to CurseForge API...');
    
    const response = await fetch(CF_URI, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "x-api-key": API_KEY,
      },
    });

    console.log('📡 API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ CurseForge API Error:', response.status);
      throw new Error(`CurseForge API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Data received successfully');

    return NextResponse.json(data);

  } catch (error) {
    console.error('💥 API Route Error:', error.message);
    return NextResponse.json(
      { error: `Error interno del servidor: ${error.message}` },
      { status: 500 }
    );
  }
}