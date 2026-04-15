import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import SavedData from '../../../models/SavedData';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.category || !body.data) {
      return NextResponse.json(
        { success: false, message: 'Please provide both category and data fields.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create a new saved data entry
    const savedData = await SavedData.create({
      category: body.category,
      toolId: body.toolId,   // Optional
      userId: body.userId,   // Optional (For future auth integration)
      data: body.data,
    });

    return NextResponse.json(
      { success: true, data: savedData, message: 'Data saved successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const toolId = searchParams.get('toolId');
    const userId = searchParams.get('userId');

    await dbConnect();

    // Build flexible query
    const query: any = {};
    if (category) query.category = category;
    if (toolId) query.toolId = toolId;
    if (userId) query.userId = userId;

    // Fetch the data sorted by newest first
    const savedData = await SavedData.find(query).sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({ success: true, data: savedData });
  } catch (error: any) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
