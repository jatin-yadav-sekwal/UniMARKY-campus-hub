import { Hono } from "hono";
import { db } from "../db";
import { studyMaterials, profiles } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireRole } from "../middleware/roleGuard";
import type { Env } from "../middleware/auth";

const studyApp = new Hono<Env>();

// --- CUH Departments (35) ---
const CUH_DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Printing & Packaging Technology",
  "Mathematics",
  "Physics & Astrophysics",
  "Chemistry",
  "Biochemistry",
  "Biotechnology",
  "Microbiology",
  "Nutrition Biology",
  "Environmental Studies",
  "Geography",
  "Statistics",
  "Economics",
  "Commerce",
  "Management Studies",
  "English & Foreign Languages",
  "Hindi",
  "Sanskrit",
  "History & Archaeology",
  "Political Science",
  "Sociology",
  "Psychology",
  "Law",
  "Journalism & Mass Communication",
  "Library & Information Science",
  "Physical Education & Sports",
  "Teacher Education",
  "Tourism & Hotel Management",
  "Pharmaceutical Sciences",
  "Vocational Studies & Skill Development",
  "Applied Sciences & Humanities",
] as const;

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"] as const;

const CATEGORIES = [
  "previous_year_papers",
  "notes",
  "sessional_exams",
  "assignments",
  "syllabus",
  "reference_books",
] as const;

// GET /departments — return list of departments + years + categories
studyApp.get("/departments", (c) => {
  return c.json({
    departments: CUH_DEPARTMENTS,
    years: YEARS,
    categories: CATEGORIES,
  });
});

// GET /mine — fetch study materials uploaded by the current user
studyApp.get("/mine", requireRole("superuser", "userX"), async (c) => {
  const userId = c.get("userId");

  const results = await db
    .select()
    .from(studyMaterials)
    .where(eq(studyMaterials.uploadedBy, userId))
    .orderBy(desc(studyMaterials.createdAt));

  return c.json(results);
});

// GET / — fetch study materials filtered by department & year (and optional category)
studyApp.get("/", async (c) => {
  const department = c.req.query("department");
  const year = c.req.query("year");
  const category = c.req.query("category");
  const universityName = c.get("universityName");

  if (!department || !year) {
    return c.json({ error: "department and year query params are required" }, 400);
  }

  const conditions = [
    eq(studyMaterials.department, department),
    eq(studyMaterials.year, year as typeof YEARS[number]),
    eq(studyMaterials.universityName, universityName),
  ];

  if (category) {
    conditions.push(eq(studyMaterials.category, category as typeof CATEGORIES[number]));
  }

  const results = await db
    .select({
      id: studyMaterials.id,
      department: studyMaterials.department,
      year: studyMaterials.year,
      subjectName: studyMaterials.subjectName,
      category: studyMaterials.category,
      title: studyMaterials.title,
      description: studyMaterials.description,
      fileUrl: studyMaterials.fileUrl,
      uploadedBy: studyMaterials.uploadedBy,
      createdAt: studyMaterials.createdAt,
      uploaderName: profiles.fullName,
    })
    .from(studyMaterials)
    .leftJoin(profiles, eq(studyMaterials.uploadedBy, profiles.id))
    .where(and(...conditions))
    .orderBy(desc(studyMaterials.createdAt));

  return c.json(results);
});

// POST / — create study material (superuser / userX only)
studyApp.post("/", requireRole("superuser", "userX"), async (c) => {
  const userId = c.get("userId");
  const universityName = c.get("universityName");
  const body = await c.req.json();

  const { department, year, subjectName, category, title, description, fileUrl } = body;

  if (!department || !year || !subjectName || !category || !title) {
    return c.json(
      { error: "department, year, subjectName, category, and title are required" },
      400
    );
  }

  if (!CUH_DEPARTMENTS.includes(department)) {
    return c.json({ error: "Invalid department" }, 400);
  }

  if (!YEARS.includes(year)) {
    return c.json({ error: "Invalid year" }, 400);
  }

  if (!CATEGORIES.includes(category)) {
    return c.json({ error: "Invalid category" }, 400);
  }

  const [created] = await db
    .insert(studyMaterials)
    .values({
      department,
      year,
      subjectName,
      category,
      title,
      description: description || null,
      fileUrl: fileUrl || null,
      uploadedBy: userId,
      universityName,
    })
    .returning();

  return c.json(created, 201);
});

// DELETE /:id — delete a study material (owner or userX)
studyApp.delete("/:id", requireRole("superuser", "userX"), async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const userRole = c.get("userRole");

  const [material] = await db
    .select()
    .from(studyMaterials)
    .where(eq(studyMaterials.id, id));

  if (!material) {
    return c.json({ error: "Study material not found" }, 404);
  }

  // Only owner or userX can delete
  if (material.uploadedBy !== userId && userRole !== "userX") {
    return c.json({ error: "Forbidden — you can only delete your own materials" }, 403);
  }

  await db.delete(studyMaterials).where(eq(studyMaterials.id, id));

  return c.json({ success: true });
});

export default studyApp;
