import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUserId(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user.id;
}

// GET - Get sales for logged-in account
export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// POST - Add a sale
export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      billNumber,
      date,
      paymentMethod,
      menuItem,
      category,
      quantity,
      price,
      revenue,
    } = body;

    const { data, error } = await supabase
      .from("sales")
      .insert([
        {
          user_id: userId,
          bill_number: billNumber,
          date,
          payment_method: paymentMethod,
          menu_item: menuItem,
          category,
          quantity: Number(quantity) || 0,
          price: Number(price) || 0,
          revenue: Number(revenue) || 0,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}

// DELETE - Delete one sale or all sales
export async function DELETE(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body: any = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const id = body?.id;

    let query = supabase
      .from("sales")
      .delete()
      .eq("user_id", userId);

    // If an ID is provided, delete only that sale.
    // If no ID is provided, delete all sales
    // belonging to the logged-in account.
    if (id !== undefined && id !== null && id !== "") {
      query = query.eq("id", id);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}