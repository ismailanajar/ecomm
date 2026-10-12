import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await req.json();
    const { role } = body; // Role string ('ADMIN' or 'CUSTOMER')

    if (!role || !Object.values(Role).includes(role as Role)) {
      return NextResponse.json({ error: { message: 'Invalid or missing role.' } }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: role as Role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Admin user role update error:', error);
    return NextResponse.json({ error: { message: error.message || 'Failed to update user.' } }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully.' });
  } catch (error: any) {
    console.error('Admin user delete error:', error);
    return NextResponse.json({ error: { message: error.message || 'Failed to delete user.' } }, { status: 500 });
  }
}
