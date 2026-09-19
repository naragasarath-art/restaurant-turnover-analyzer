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

// Get all expenses for the logged-in account
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
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("expense_date", { ascending: false });

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

// Save or update expenses for a particular date
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
      expenseDate,
      staffSalary,
      rent,
      electricity,
      water,
      rawMaterials,
      otherExpenses,
    } = body;

    if (!expenseDate) {
      return NextResponse.json(
        { error: "Expense date is required." },
        { status: 400 }
      );
    }

    // Check whether an expense already exists for this date
    const { data: existingExpense, error: findError } =
      await supabase
        .from("expenses")
        .select("id")
        .eq("user_id", userId)
        .eq("expense_date", expenseDate)
        .maybeSingle();

    if (findError) {
      return NextResponse.json(
        { error: findError.message },
        { status: 500 }
      );
    }

    // Update existing expense
    if (existingExpense) {
      const { data, error } = await supabase
        .from("expenses")
        .update({
          staff_salary: Number(staffSalary) || 0,
          rent: Number(rent) || 0,
          electricity: Number(electricity) || 0,
          water: Number(water) || 0,
          raw_materials: Number(rawMaterials) || 0,
          other_expenses: Number(otherExpenses) || 0,
        })
        .eq("id", existingExpense.id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    }

    // Create new expense
    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          user_id: userId,
          expense_date: expenseDate,
          staff_salary: Number(staffSalary) || 0,
          rent: Number(rent) || 0,
          electricity: Number(electricity) || 0,
          water: Number(water) || 0,
          raw_materials: Number(rawMaterials) || 0,
          other_expenses: Number(otherExpenses) || 0,
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

// Clear all expenses for the logged-in account
export async function DELETE(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("user_id", userId);

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