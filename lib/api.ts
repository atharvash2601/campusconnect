import { NextResponse } from "next/server";

export function success(data: unknown, message = "OK", status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function failure(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export function isObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}
