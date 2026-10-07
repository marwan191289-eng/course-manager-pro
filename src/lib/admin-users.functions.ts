import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("غير مصرح — هذه العملية للمدير فقط");
}

export const listStudents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: users }, { data: profiles }, { data: roles }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
      supabaseAdmin.from("profiles").select("id, full_name, phone, gender"),
      supabaseAdmin.from("user_roles").select("user_id, role"),
    ]);
    return (users?.users ?? []).map((u) => {
      const p = profiles?.find((x) => x.id === u.id);
      const rs = (roles ?? []).filter((r) => r.user_id === u.id).map((r) => r.role as string);
      return {
        id: u.id,
        email: u.email ?? "",
        name: p?.full_name ?? "",
        phone: p?.phone ?? "",
        gender: (p as any)?.gender ?? "male",
        role: rs.includes("admin") ? "admin" : "student",
        createdAt: u.created_at,
      };
    });
  });

export const createStudent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      name: z.string().trim().min(2).max(100),
      email: z.string().trim().email().max(255),
      password: z.string().min(8).max(72),
      phone: z.string().trim().max(30).default(""),
      gender: z.enum(["male", "female"]),
      role: z.enum(["student", "admin"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.name },
    });
    if (error || !created.user) throw new Error(error?.message.includes("already") ? "هذا البريد مسجل مسبقاً" : error?.message ?? "تعذر إنشاء الحساب");
    const id = created.user.id;
    await supabaseAdmin.from("profiles").upsert({ id, full_name: data.name, phone: data.phone, gender: data.gender } as any);
    if (data.role === "admin") await supabaseAdmin.from("user_roles").upsert({ user_id: id, role: "admin" }, { onConflict: "user_id,role" });
    return { id };
  });

export const updateStudentRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), role: z.enum(["student", "admin"]), gender: z.enum(["male", "female"]) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.id === context.userId && data.role !== "admin") throw new Error("لا يمكنك إزالة صلاحية المدير عن حسابك");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("profiles").update({ gender: data.gender } as any).eq("id", data.id);
    await supabaseAdmin.from("user_roles").upsert({ user_id: data.id, role: "student" }, { onConflict: "user_id,role" });
    if (data.role === "admin") await supabaseAdmin.from("user_roles").upsert({ user_id: data.id, role: "admin" }, { onConflict: "user_id,role" });
    else await supabaseAdmin.from("user_roles").delete().eq("user_id", data.id).eq("role", "admin");
    return { ok: true };
  });

export const deleteStudent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.id === context.userId) throw new Error("لا يمكنك حذف حسابك");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
