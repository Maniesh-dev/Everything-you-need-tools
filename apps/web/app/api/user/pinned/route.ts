import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAccessToken } from '@/lib/auth';

/**
 * Helper to extract userId from auth header
 */
function getUserIdFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  try {
    const payload = verifyAccessToken(token);
    return payload.userId;
  } catch {
    return null;
  }
}

/**
 * GET /api/user/pinned
 * Returns the array of pinned tool slugs
 */
export async function GET(req: Request) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(userId).select('pinnedTools');
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, pinnedTools: user.pinnedTools || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

/**
 * POST /api/user/pinned
 * Expects { toolSlug: string }
 * Toggles the pin status for the given tool
 */
export async function POST(req: Request) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { toolSlug } = await req.json();
    if (!toolSlug) {
      return NextResponse.json({ success: false, message: 'toolSlug is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (!user.pinnedTools) {
      user.pinnedTools = [];
    }

    // Convert Mongoose strings to primitive JS strings
    let currentTools = user.pinnedTools.map((t: string) => t.toString());
    const index = currentTools.indexOf(toolSlug);
    
    if (index === -1) {
      currentTools.push(toolSlug);
    } else {
      currentTools = currentTools.filter((slug: string) => slug !== toolSlug);
    }

    user.pinnedTools = currentTools;
    await user.save();

    return NextResponse.json({ success: true, pinnedTools: currentTools });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
