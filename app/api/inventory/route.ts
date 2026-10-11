
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUserId(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user.id;
}

// Get inventory belonging to the logged-in user
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
      .from("inventory_items")
      .select("id, name, quantity, minimum_stock, unit, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Inventory GET error:", error.message);
      return NextResponse.json(
        { error: "Could not load inventory." },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// Add an inventory item
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

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const quantity = Number(body.quantity);
    const minimumStock = Number(body.minimumStock);
    const unit =
      typeof body.unit === "string" ? body.unit.trim() : "";

    if (
      !name ||
      body.quantity === "" ||
      body.minimumStock === "" ||
      !Number.isFinite(quantity) ||
      !Number.isFinite(minimumStock) ||
      quantity < 0 ||
      minimumStock < 0 ||
      !unit
    ) {
      return NextResponse.json(
        { error: "Enter valid inventory details." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("inventory_items")
      .insert({
        user_id: userId,
        name,
        quantity,
        minimum_stock: minimumStock,
        unit,
      })
      .select("id, name, quantity, minimum_stock, unit, created_at")
      .single();

    if (error) {
      console.error("Inventory POST error:", error.message);
      return NextResponse.json(
        { error: "Could not save inventory item." },
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

// Update an inventory item's stock
export async function PATCH(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = Number(body.id);
    const quantity = Number(body.quantity);

    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      body.quantity === "" ||
      !Number.isFinite(quantity) ||
      quantity < 0
    ) {
      return NextResponse.json(
        { error: "Enter a valid item ID and quantity." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("inventory_items")
      .update({ quantity })
      .eq("id", id)
      .eq("user_id", userId)
      .select("id, name, quantity, minimum_stock, unit, created_at")
      .maybeSingle();

    if (error) {
      console.error("Inventory PATCH error:", error.message);
      return NextResponse.json(
        { error: "Could not update inventory." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Inventory item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}

// Delete one inventory item
export async function DELETE(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "A valid inventory item ID is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Inventory DELETE error:", error.message);
      return NextResponse.json(
        { error: "Could not delete inventory item." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Inventory item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
