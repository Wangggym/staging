import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 这里可以添加更多的健康检查逻辑
    // 例如：检查数据库连接、外部服务等

    return NextResponse.json({ status: 'healthy' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Health check failed' },
      { status: 500 }
    );
  }
} 