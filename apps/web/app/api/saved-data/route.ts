import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import SavedData from '../../../models/SavedData';
import { getAuthUser } from '../../../lib/api-auth';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Internal Server Error';
}

export async function POST(req: Request) {
  try {
    let authUser;
    try {
      authUser = getAuthUser(req);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

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
      userId: authUser.userId,
      data: body.data,
    });

    return NextResponse.json(
      { success: true, data: savedData, message: 'Data saved successfully!' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    let authUser;
    try {
      authUser = getAuthUser(req);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const toolId = searchParams.get('toolId');

    await dbConnect();

    // Build flexible query
    const query: { category?: string; toolId?: string; userId: string } = {
      userId: authUser.userId,
    };
    if (category) query.category = category;
    if (toolId) query.toolId = toolId;

    // Fetch the data sorted by newest first
    const savedData = await SavedData.find(query).sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({ success: true, data: savedData });
  } catch (error: unknown) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
